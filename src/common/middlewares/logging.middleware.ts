import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, baseUrl, body, params, protocol, query, rawHeaders } = request;
    const userAgent = request.get('user-agent') || '';
    const {password, ...bodyLog} = body;

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${baseUrl}${url} ${JSON.stringify(params)} ${JSON.stringify(bodyLog)} ${JSON.stringify(query)} ${rawHeaders} ${protocol} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
      );
    });

    next();
  }
}
