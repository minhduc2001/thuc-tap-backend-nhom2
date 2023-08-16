import { config } from '@/config';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@base/logger';

export function uploadUrl(filename: string): string {
  return `${config.IP}:${config.PORT}/api/v${config.API_VERSION}/uploads/${filename}`;
}

@Injectable()
export class UrlService {
  constructor(private readonly loggerService: LoggerService) {}
  private logger = this.loggerService.getLogger(UrlService.name);

  uploadUrl(filename: string): string {
    if (filename.includes('http')) return filename;
    return `http://${config.IP}:${config.PORT}/uploads/${filename}`;
  }

  dataUrl(filename: string): string {
    if (filename.includes('http')) return filename;
    return `http://${config.IP}:${config.PORT}/audio/${
      filename.split('.')[0]
    }/${filename}`;
  }

  uploadUrls(filenames: string[]) {
    return filenames.map((filename) => {
      if (filename.includes('http')) return filename;
      return `http://${config.IP}:${config.PORT}/uploads/${filename}`;
    });
  }
}
