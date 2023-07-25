import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@base/logger';

@Injectable()
export class FileService {
  constructor(private readonly loggerService: LoggerService) {}
  private logger = this.loggerService.getLogger(FileService.name);

  removeFile(filePath: string, root: string) {
    if (filePath.split('.').at(-1) == 'm3u8') {
      fs.rm(
        path.join('audio', filePath.split('.')[0]),
        { recursive: true, force: true },
        (e) => {
          if (e) this.logger.error(e.message);
        },
      );
      return;
    }
    const link = path.join(root, filePath);
    fs.unlink(link, (error) => {
      if (error) {
        this.logger.error(error.message);
      }
    });
  }
}
