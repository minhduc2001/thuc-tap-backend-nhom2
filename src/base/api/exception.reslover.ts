import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError as NestValidationError } from '@nestjs/common';

import { Payload, defaultPayload } from '@base/api/api.response';

// GLOBAL
export const SUCCESS = '000';
export const UNKNOWN = '999';
export const SYSTEM_ERROR = '666';
export const NOT_FOUND = '404';
export const PAYMENT_REQUIRE = '402';
export const FORBIDDEN = '403';
export const UNSUPPORTED_MEDIA_TYPE = '415';

const ALL_MESSAGES: Record<string, string> = {
  [SUCCESS]: 'Success',
  [UNKNOWN]: 'Unknown error',
  [SYSTEM_ERROR]: 'System error',
  [FORBIDDEN]: 'Refuses to authorize',
  [PAYMENT_REQUIRE]: 'You have to pay the package',
  [UNSUPPORTED_MEDIA_TYPE]: 'Unsupported format file',
};

export const STATUS_CODE_MAP: Record<string, any> = {
  [HttpStatus.NOT_FOUND]: NOT_FOUND,
};

const getMessageFromCode = (
  errorCode: string,
  defaultMessage: string,
): string => {
  let message = ALL_MESSAGES[errorCode] || '';
  message = message || defaultMessage;
  return message;
};

export abstract class BaseException<T> extends HttpException {
  constructor(partial: Payload<T>, statusCode: number, defaultMessage = '') {
    const payload = {
      ...defaultPayload,
      ...partial,
    };
    payload.success = payload.errorCode === SUCCESS && payload.message === '';
    payload.message =
      payload.message || getMessageFromCode(payload.errorCode, defaultMessage);
    super(payload, statusCode);
  }
}

export class BadRequest<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.ACCEPTED);
  }
}

export class BusinessException<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class Unauthorized<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.UNAUTHORIZED);
  }
}

export class Forbidden<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.FORBIDDEN, ALL_MESSAGES[FORBIDDEN]);
  }
}

export class NotFound<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.NOT_FOUND, ALL_MESSAGES[NOT_FOUND]);
  }
}

export class PaymentRequire<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.PAYMENT_REQUIRED, ALL_MESSAGES[PAYMENT_REQUIRE]);
  }
}

export class UnsupportedMediaType<T> extends BaseException<T> {
  constructor(payload: Payload<T>) {
    super(payload, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}

export class QueryDbError extends BaseException<any> {
  constructor(payload: Payload<any>) {
    super(payload, HttpStatus.BAD_REQUEST);
  }
}
