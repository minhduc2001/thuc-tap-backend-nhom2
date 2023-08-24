import { ListDto, UploadImageDto } from '@shared/dtos/common.dto';
import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, Trim } from '@base/decorators/common.decorator';
import { EPackageExpire } from '@/package/package.enum';

export class ListPackageDto extends ListDto {}
export class CreatePackageDto extends UploadImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @ToNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EPackageExpire)
  expire: EPackageExpire;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Trim()
  description: string;
}

export class UpdatePackageDto extends PickType(CreatePackageDto, [
  'amount',
  'description',
  'expire',
  'image',
]) {
  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  id: number;
}
