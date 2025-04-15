import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request as ReqDecorator } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() dto: any) {
    const users = await this.usersService.findAll();
    if (users.length === 0) {
      // Criação do primeiro usuário
      const newUser = await this.usersService.create(dto);
      return this.authService.login(newUser);
    }

    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    return this.authService.login(user);
  }

  @Get('exists')
  @ApiOperation({ summary: 'Verifica se existe ao menos um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Retorna true se existir ao menos um usuário',
  })
  exists() {
    return this.usersService.hasAny();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
