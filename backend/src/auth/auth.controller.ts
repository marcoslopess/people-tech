import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      // Criação do primeiro usuário
      return this.authService.createFirstUser(dto);
    }

    return this.authService.login(dto);
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
