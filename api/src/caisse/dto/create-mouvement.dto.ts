import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TypeMouvement {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
}

export class CreateMouvementCaisseDto {
  @ApiProperty({ example: '2026-07-12T10:00:00.000Z', description: 'Date du mouvement' })
  @IsDateString({}, { message: 'La date doit être au format ISO 8601' })
  date: string;

  @ApiProperty({ example: 'Offrande du dimanche', description: 'Motif du mouvement' })
  @IsString()
  @MinLength(2, { message: 'Le motif doit contenir au moins 2 caractères' })
  motif: string;

  @ApiProperty({ example: 385000, description: 'Montant en FCFA (toujours positif)' })
  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(1, { message: 'Le montant doit être supérieur à 0' })
  montant: number;

  @ApiProperty({ enum: TypeMouvement, example: TypeMouvement.ENTREE })
  @IsEnum(TypeMouvement, { message: 'Le type doit être ENTREE ou SORTIE' })
  type: TypeMouvement;

  @ApiProperty({ example: 'Frère Kouadio', description: 'Responsable / auteur' })
  @IsString()
  @MinLength(2, { message: 'Le responsable doit contenir au moins 2 caractères' })
  par: string;

  @ApiPropertyOptional({ example: 'Remarque optionnelle' })
  @IsOptional()
  @IsString()
  note?: string;
}
