import { Injectable, NestMiddleware, BadRequestException, RequestMethod, ConsoleLogger } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class DiscordTokenAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.discordToken) {
      throw new BadRequestException('discordToken無效');
    }
    next();
  }
}

export const routesRequiringDiscordTokenAuth: (RouteInfo | string)[] = ['/api/guild(/.*)?'];
