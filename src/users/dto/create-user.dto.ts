import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsValidCPF } from '../../common/validators/cpf.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  sobrenome: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsValidCPF()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;
}