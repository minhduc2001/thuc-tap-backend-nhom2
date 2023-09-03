import { Injectable } from '@nestjs/common';
import * as ip from 'ip';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const _process = { env: process.env };
process.env = {};

@Injectable()
export class ConfigService {
  FIXED_STATUS_CODE =
    (_process.env.SENTRY_LOG ?? 'true').toLowerCase() === 'true';
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';

  PORT = _process.env.PORT ?? 8080;

  IP = ip.address();
  API_VERSION = '1';

  // db
  DB_DATABASE = _process.env.DB_DATABASE;
  DB_PASSWORD = _process.env.DB_PASSWORD;
  DB_USERNAME = _process.env.DB_USERNAME;
  DB_HOST = _process.env.DB_HOST;
  DB_PORT = Number(_process.env.DB_PORT);

  // jwt
  JWT_SECRET = _process.env.JWT_SECRET;
  JWT_RT_SECRET = _process.env.JWT_RT_SECRET;

  // google auth
  GOOGLE_CLIENT_SECRET = _process.env.GOOGLE_CLIENT_SECRET;
  GOOGLE_CLIENT_ID = _process.env.GOOGLE_CLIENT_ID;

  //facebook auth
  FACEBOOK_APP_ID = _process.env.FACEBOOK_APP_ID;
  FACEBOOK_APP_SECRET = _process.env.FACEBOOK_APP_SECRET;

  // Firebase
  FIREBASE_PROJECT_ID = _process.env.FIREBASE_PROJECT_ID;
  FIREBASE_PRIVATE_KEY = _process.env.FIREBASE_PRIVATE_KEY;
  FIREBASE_CLIENT_EMAIL = _process.env.FIREBASE_CLIENT_EMAIL;

  // mailer
  EMAIL = _process.env.EMAIL;
  EMAIL_CLIENT_ID = _process.env.EMAIL_CLIENT_ID;
  EMAIL_CLIENT_SECRET = _process.env.EMAIL_CLIENT_SECRET;
  EMAIL_REDIRECT_URI = _process.env.EMAIL_REDIRECT_URI;
  EMAIL_REFRESH_TOKEN = _process.env.EMAIL_REFRESH_TOKEN;

  // file
  MAX_FILE_SIZE = 200000000; // 10MB;
  UPLOAD_LOCATION = 'uploads';
  UPLOAD_LOCATION_AUDIO = 'audio';

  // Momo
  MOMO_PARTNER_CODE = _process.env.MOMO_PARTNER_CODE;
  MOMO_ACCESS_KEY = _process.env.MOMO_ACCESS_KEY;
  MOMO_SECRET_KEY = _process.env.MOMO_SECRET_KEY;
  MOMO_ENVIRONMENT = _process.env.MOMO_ENVIRONMENT ?? 'development';

  // vnpay
  VNP_TMNCODE = _process.env.VNP_TMNCODE;
  VNP_HASH_SECRET = _process.env.VNP_HASH_SECRET;
  VNP_URL = _process.env.VNP_URL;
  VNP_API = _process.env.VNP_API;
  VNP_RETURN_URL = _process.env.VNP_RETURN_URL;

  // Redis
  REDIS_HOST = _process.env.REDIS_HOST;
  REDIS_PORT = +_process.env.REDIS_PORT;
}

export const config = new ConfigService();
