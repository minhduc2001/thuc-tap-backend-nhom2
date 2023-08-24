import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth/decorator/public.decorator';
import { PackageService } from '@/package/package.service';
import {
  CreatePackageDto,
  ListPackageDto,
  UpdatePackageDto,
} from '@/package/package.dto';
import { Roles } from '@/role/roles.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { BulkIdsDto, ParamIdDto } from '@shared/dtos/common.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Package')
@Controller('package')
export class PackageController {
  constructor(private readonly service: PackageService) {}

  @Public()
  @Roles(ERole.Admin)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createPackage(
    @Body() dto: CreatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.createPackage({ ...dto, image: file.filename });
  }

  @Get()
  async listPackage(@Query() query: ListPackageDto) {
    return this.service.listPackage(query);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updatePackage(
    @Param() param: ParamIdDto,
    @Body() dto: UpdatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updatePackage({
      ...param,
      ...dto,
      image: file.filename,
    });
  }

  @Delete()
  async bulkDeletePackage(@Body() dto: BulkIdsDto) {
    return this.service.bulkDeletePackage(dto.ids);
  }
}
