import { ListDto } from '@shared/dtos/common.dto';
import {
  ApiHideProperty,
  ApiProperty,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToNumber, ToNumbers, Trim } from '@base/decorators/common.decorator';

export class ListAudioBookDto extends ListDto {}

export class UploadMusicDto {
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  image: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
    required: false,
  })
  @IsOptional()
  audio: string;
}

export class CreateAudioBookDto extends UploadMusicDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @ToNumber()
  publishDate: number;

  @ApiProperty({ required: false })
  @IsString()
  @Trim()
  @IsOptional()
  desc: string;

  @ApiProperty({ required: false })
  @ToNumber()
  @IsOptional()
  @IsPositive()
  genre: number;

  @ApiProperty({ required: false })
  @IsArray()
  @ToNumbers()
  @IsOptional()
  @IsPositive({ each: true })
  author: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @ToNumber()
  duration: number;
}

export class UpdateAudioBookDto extends PickType(CreateAudioBookDto, [
  'audio',
  'image',
  'duration',
  'author',
  'genre',
  'publishDate',
  'desc',
]) {
  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  @IsString()
  title: string;

  @ApiHideProperty()
  @IsOptional()
  @ToNumber()
  @IsPositive()
  id: number;
}
