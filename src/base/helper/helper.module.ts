import { Module, Global } from '@nestjs/common';
import { FileService } from '@base/helper/file.service';
import { UrlService } from './url.service';

@Global()
@Module({
  providers: [FileService, UrlService],
  exports: [FileService, UrlService],
})
export class HelperModule {}
