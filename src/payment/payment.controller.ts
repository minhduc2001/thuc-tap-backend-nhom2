import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/decorator/public.decorator';
import { CreatePaymentDto } from '@/payment/payment.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/user.entity';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto, @GetUser() user: User) {
    return this.service.createPayment({ ...dto, user: user });
  }

  @Public()
  @Post('success')
  async successPayment(@Body() body: any) {
    console.log(body);

    return this.service.confirmPayment(body);
  }
}
