import { Trim } from '@/base/decorators/common.decorator';
import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { ListDto, UploadImageDto } from '@shared/dtos/common.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListAuthorDto extends ListDto {}

export class SaveAuthorDto extends UploadImageDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @Trim()
  @IsOptional()
  description: string;
}

export class UpdateAuthorDto extends PickType(SaveAuthorDto, [
  'description',
  'name',
  'image',
]) {
  @ApiHideProperty()
  @IsOptional()
  id: number;
}
