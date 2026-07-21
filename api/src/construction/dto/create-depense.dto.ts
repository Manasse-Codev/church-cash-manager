import { IsString, IsNumber, IsDateString, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepenseConstructionDto {
  @ApiProperty({ example: '2026-07-04T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Sacs de ciment (200 sacs)' })
  @IsString()
  @MinLength(2)
  article: string;

  @ApiProperty({ example: 480000 })
  @IsNumber()
  @Min(1)
  montant: number;

  @ApiProperty({ example: 'SCIMAF Abidjan' })
  @IsString()
  @MinLength(2)
  fournisseur: string;

  @ApiProperty({ example: 'Matériaux', description: 'Matériaux | Main d\'œuvre | Honoraires | Plomberie | Autre' })
  @IsString()
  categorie: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
