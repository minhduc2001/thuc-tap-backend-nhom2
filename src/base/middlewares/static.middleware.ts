import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export class StaticMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('Request...');
    // console.log(req.url);
    // console.log(req.headers)
    next();
  }
}
