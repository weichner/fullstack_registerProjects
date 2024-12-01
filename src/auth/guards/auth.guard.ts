import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; // Bearer <token>
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const tokenPayLoad = await this.jwtService.verifyAsync(token);

      request.user = {
        id: tokenPayLoad.id,
        name: tokenPayLoad.name,
        role: tokenPayLoad.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
