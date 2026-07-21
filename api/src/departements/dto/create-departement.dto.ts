import { IsString, IsNumber, IsOptional, MinLength, Min, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartementDto {
  @ApiProperty({ example: 'Chœur' })
  @IsString()
  @MinLength(2)
  nom: string;

  @ApiProperty({ example: 'Louange & Adoration' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Music', description: 'Nom de l\'icône Lucide' })
  @IsString()
  icon: string;

  @ApiProperty({ example: '#1B3FA6' })
  @IsString()
  color: string;

  @ApiProperty({ example: '#EEF3FF' })
  @IsString()
  bg: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  membres?: number;
}
