import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Trim } from '@/base/decorators/common.decorator';

export class LoginDto {
  @ApiProperty({ required: true, example: '0768368218' })
  @IsNotEmpty({ message: 'số điện thoại không được để trống' })
  @Transform(({ value }) => value && value.trim())
  @IsString()
  email: string;

  @ApiProperty({ required: true, example: '123123' })
  @IsNotEmpty({ message: 'USER011101' })
  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {}

export class ForgotPasswordDto extends PickType(LoginDto, ['email']) {}

export class ResetPasswordDto extends ForgotPasswordDto {
  @ApiProperty({ required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  newPassword: string;

  @ApiProperty({ required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  otp: string;
}
