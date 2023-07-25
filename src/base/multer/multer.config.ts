import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as exc from '@base/api/exception.reslover';
import { config } from '@/config';
import { makeUUID } from '@base/helper/function.helper';

export const multerConfig = {
  dest: config.UPLOAD_LOCATION,
  audio: config.UPLOAD_LOCATION_AUDIO,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(/\/(jpg|jpeg|png|gif)$/) ||
      file.mimetype.match(/\.xlsx$/i) ||
      file.mimetype.match(/audio/)
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new exc.UnsupportedMediaType({
          message: `Unsupported file type ${extname(file.originalname)}`,
        }),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      let uploadPath = '';
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        uploadPath = multerConfig.dest;
      } else if (file.mimetype.match(/audio/)) {
        uploadPath = multerConfig.audio;
      } else {
        // Handle other file types if needed
        uploadPath = 'other/directory';
      }
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${makeUUID(file.originalname)}`);
    },
  }),
};
