import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { MomoPayment } from 'momo-payment-api';
import { config } from '@/base/config';
import { SubscriptionService } from './subscription.service';
import { RedisService } from '@/base/redis/redis.service';
import { LoggerService } from '@/base/logger';
import { PackageService } from '@/package/package.service';
import { User } from '@/user/user.entity';
import { EMethodPayment, EStatePayment } from './payment.enum';
import * as exc from '@base/api/exception.reslover';
import { BaseService } from '@/base/service/base.service';
import { EPackageExpire } from '@/package/package.enum';
import { CreatePaymentDto } from './payment.dto';
import { generateUUID } from '@/base/helper/function.helper';
import {
  IResponsePayment,
  IResponseSuccessPayment,
} from 'momo-payment-api/src/type';
import { MailerService } from '@/mailer/mailer.service';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  private momoPayment: MomoPayment;
  private redisSubscriber: Redis;
  constructor(
    @InjectRepository(Payment)
    protected readonly repository: Repository<Payment>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    private readonly packageService: PackageService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
    private readonly subscriptionService: SubscriptionService,
    private readonly mailerService: MailerService,
  ) {
    super(repository);
    this.redisSubscriber = new Redis();
    this.momoPayment = new MomoPayment(
      config.MOMO_PARTNER_CODE,
      config.MOMO_ACCESS_KEY,
      config.MOMO_SECRET_KEY,
      config.MOMO_ENVIRONMENT,
    );
  }
  private logger = this.loggerService.getLogger(PaymentService.name);

  async onModuleInit() {
    await this.redisSubscriber.psubscribe(
      '__keyevent@0__:expired',
      async (error, count) => {
        if (error) {
          this.logger.error(error);
          return;
        }
        console.log(`Subscribed to ${count} channel(s)`);
      },
    );

    this.redisSubscriber.on('pmessage', async (pattern, channel, message) => {
      if (channel === '__keyevent@0__:expired') {
        if (message.startsWith('transaction:')) {
          const id = message.split(':')[1];
          await this.cancelPayment(Number(id));
        }
      }
    });
  }
  async getPayment(id: number) {
    const payment = await this.repository.findOne({ where: { id: id } });
    if (!payment)
      throw new exc.BadRequest({ message: 'không tồn tại thanh toán này' });
    return payment;
  }

  async getPaymentWithOrderId(orderId: string) {
    const payment = await this.repository.findOne({
      where: { orderId: orderId },
      relations: { user: true, package: true },
    });
    if (!payment)
      throw new exc.BadRequest({ message: 'không tồn tại thanh toán này' });
    return payment;
  }

  async createPayment(dto: CreatePaymentDto) {
    try {
      const pack = await this.packageService.getPackage(dto.packageId);
      const date = new Date().getTime();
      const payment = await this.repository.save({
        amount: pack.amount,
        state: EStatePayment.Pending,
        paymentMethod: EMethodPayment.Momo,
        user: dto.user,
        package: pack,
        requestId: `REQ${dto.user.id}${date}`,
        orderId: `ORD${dto.user.id}${date}`,
      });

      const res: IResponsePayment = await this.momoPayment.createPayment({
        requestId: payment.requestId,
        orderId: payment.orderId,
        amount: payment.package.amount,
        orderInfo: `Thanh toán Momo`,
        ipnUrl:
          'https://dbfa-2405-4802-1ed1-f900-5673-2066-d60d-4979.ngrok.io/api/v1/payment/success',
        redirectUrl: 'http://localhost:3000',
      });

      await this.redisService.setWithExpiration(
        `transaction:${payment.id}`,
        payment,
        10 * 60,
      );

      await this.mailerService.sendMail(
        dto.user.email,
        'Thanh toán gói cước',
        res.payUrl,
      );

      return res.payUrl;
    } catch (e) {
      this.logger.warn(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }

  async cancelPayment(id: number) {
    try {
      const payment = await this.getPayment(id);
      payment.state = EStatePayment.Failure;
      await payment.save();
      return true;
    } catch (e) {
      throw new exc.BadRequest({ message: e.message });
    }
  }

  async confirmPayment(body: IResponseSuccessPayment) {
    try {
      const payment = await this.getPaymentWithOrderId(body.orderId);
      if (
        payment.state == EStatePayment.Failure ||
        payment.state == EStatePayment.Finished
      ) {
        const date = new Date().getTime();
        const res = await this.momoPayment.refundPayment({
          requestId: `REQ${payment.user.id}${date}`,
          orderId: `ORD${payment.user.id}${date}`,
          transId: body.transId,
          amount: payment.amount,
        });

        return false;
      }
      payment.state = EStatePayment.Finished;
      await payment.save();

      // set gói cho user
      const user = await this.userRepository.findOne({
        where: { id: payment.user.id },
      });
      user.packageId = payment.package.id;
      const date = new Date().getTime();
      if (payment.package.expire == EPackageExpire.Daily) {
        user.packageExpire = String(date + 86400000);
      } else if (payment.package.expire == EPackageExpire.Month) {
        user.packageExpire = String(date + 86400000 * 30);
      } else {
        user.packageExpire = String(date + 86400000 * 30 * 12);
      }
      await user.save();

      // khởi tạo thời gian hủy gói
      await this.subscriptionService.createSubscription({
        userId: user.id,
        delay: Number(user.packageExpire) - date,
      });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }
}
