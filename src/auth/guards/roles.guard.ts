import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Token missing or invalid format'); // Diagnóstico
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authorization?.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      return requiredRoles.includes(payload.role);
    } catch (error) {
      return false;
    }
  }
}
