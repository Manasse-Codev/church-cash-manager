import { IsString, IsNumber, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvestisseurDto {
  @ApiProperty({ example: 'Frère Emmanuel Kouadio' })
  @IsString()
  @MinLength(2)
  nom: string;

  @ApiProperty({ example: 'Ancien' })
  @IsString()
  categorie: string;

  @ApiProperty({ example: 500000, description: 'Montant promis en FCFA' })
  @IsNumber()
  @Min(1)
  promesse: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
