import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMembreDto {
  @ApiProperty({ example: 'Kouadio' })
  @IsString()
  @MinLength(2)
  nom: string;

  @ApiProperty({ example: 'Emmanuel' })
  @IsString()
  @MinLength(2)
  prenom: string;

  @ApiProperty({ example: 'Ancien', description: 'Ancien | Diacre | Membre | Bienfaiteur | Jeunesse' })
  @IsString()
  categorie: string;

  @ApiProperty({ example: '+225 07 01 23 45 67' })
  @IsString()
  telephone: string;

  @ApiPropertyOptional({
    description: 'Champs dynamiques supplémentaires (JSON)',
    example: { quartier: 'Cocody', dateNaissance: '1985-03-15' },
  })
  @IsOptional()
  champsDynamiques?: Record<string, unknown>;
}
