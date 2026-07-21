import { IsString, IsNumber, IsDateString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMouvementDepartementDto {
  @ApiProperty({ example: '2026-07-10T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Dotation mensuelle' })
  @IsString()
  @MinLength(2)
  motif: string;

  @ApiProperty({ example: 150000, description: 'Positif = entrée, Négatif = dépense' })
  @IsNumber()
  montant: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
