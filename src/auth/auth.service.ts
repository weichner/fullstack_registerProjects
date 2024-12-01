import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { name: string; password: string };
type SignInData = { id: number; name: string; role: string };
type AuthResult = {
  accessToken: string;
  id: number;
  name: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findUserByName(input.name);

    if (user && (await bcrypt.compare(input.password, user.password))) {
      return { id: user.id, name: user.name, role: user.role };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = { id: user.id, name: user.name, role: user.role };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      name: user.name,
      id: user.id,
      role: user.role,
    };
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }
}
