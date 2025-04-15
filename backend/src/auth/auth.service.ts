import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async login(dto: LoginDto) {
    this.logger.log(`Tentando login com email: ${dto.email}`);

    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`Usuário não encontrado: ${dto.email}`);
      throw new ForbiddenException('Credenciais inválidas');
    }

    const senhaCorreta = await bcrypt.compare(dto.password, user.password);

    if (!senhaCorreta) {
      this.logger.warn(`Senha incorreta para email: ${dto.email}`);
      throw new ForbiddenException('Credenciais inválidas');
    }

    return this.generateToken(user);
  }

  async createFirstUser(dto: any) {
    this.logger.warn(`Criando o primeiro usuário`);
    const { exists } = await this.usersService.hasAny();
    if (exists) {
      throw new ForbiddenException('Primeiro usuário já existe');
    }

    const userToCreate = {
      ...dto,
      name: dto.name ?? 'Novo Usuário',
    };

    const newUser = await this.usersService.create(userToCreate);
    return this.generateToken(newUser);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
