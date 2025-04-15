// Atualização no DTO de criação de usuário para incluir senha
// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail válido' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha com no mínimo 6 caracteres',
  })
  @MinLength(6)
  password: string;
}
