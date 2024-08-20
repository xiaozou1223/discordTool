import { Injectable, NestMiddleware, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from 'src/jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const jwToken = req.cookies['jwt'];
    if (!jwToken) {
      throw new UnauthorizedException('JWT 不存在');
    }
    const decodedUser = verifyJwt(jwToken);
    if (!decodedUser) {
      res.cookie('jwt', '', { expires: new Date(0) });
      throw new UnauthorizedException('JWT 驗證失敗');
    }
    req.user = decodedUser;
    if (req.user.isTokenValid) {
      try {
        req.discordToken = await this.userService.getToken(req.user.account);
      } catch (error) {
        throw new UnauthorizedException('無法獲取 Discord Token');
      }
    }
    next();
  }
}

export const routesRequiringJwtAuth: (RouteInfo | string)[] = ['/api/guild(/.*)?', '/api/user(/.*)?'];

export const routesWithoutJwtAuth: (RouteInfo | string)[] = [{ path: '/api/user', method: RequestMethod.POST }];
