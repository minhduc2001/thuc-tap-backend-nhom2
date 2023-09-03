import { Module, Global } from '@nestjs/common';
import { FileService } from '@base/helper/file.service';
import { UrlService } from './url.service';
import { VnpayService } from '@base/helper/vnpay.service';

@Global()
@Module({
  providers: [FileService, UrlService, VnpayService],
  exports: [FileService, UrlService, VnpayService],
})
export class HelperModule {}
