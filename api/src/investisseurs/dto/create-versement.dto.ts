import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVersementDto {
  @ApiProperty({ example: '2026-07-12T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @Min(1)
  montant: number;

  @ApiProperty({ example: 'Mobile Money', description: 'Mobile Money | Espèces | Virement bancaire | Chèque' })
  @IsString()
  methode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
