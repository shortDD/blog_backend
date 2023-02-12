import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();
    const status = exception.getStatus();
    res.status(status).json({
      code: status,
      success: false,
      path: req.url,
      data: exception.getResponse(),
      timestamp: new Date().getTime(),
    });
  }
}
