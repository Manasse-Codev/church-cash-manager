import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@eglise.cg', description: "Adresse email de l'utilisateur" })
  @IsEmail({}, { message: "L'email n'est pas valide" })
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Mot de passe (min. 6 caractères)' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
