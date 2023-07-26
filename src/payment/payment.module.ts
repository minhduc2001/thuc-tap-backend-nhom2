import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@/base/redis/redis.module';
import { User } from '@/user/user.entity';
import { PackageModule } from '@/package/package.module';
import { SubscriptionService } from './subscription.service';
import { TerminatePackageConsumer } from './terminate-package-consumer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    BullModule.registerQueue({
      name: 'terminate-package',
    }),
    PackageModule,
    RedisModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, SubscriptionService, TerminatePackageConsumer],
})
export class PaymentModule {}
