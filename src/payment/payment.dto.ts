import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { ToNumber } from '@base/decorators/common.decorator';
import { User } from '@/user/user.entity';
import { EMethodPayment } from '@/payment/payment.enum';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsPositive()
  packageId: number;

  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsEnum(EMethodPayment)
  methodPayment: EMethodPayment;

  @ApiHideProperty()
  @IsOptional()
  user: User;
}
