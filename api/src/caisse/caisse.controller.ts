import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CaisseService } from './caisse.service';
import { CreateMouvementCaisseDto } from './dto/create-mouvement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('caisse')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('caisse')
export class CaisseController {
  constructor(private readonly caisseService: CaisseService) {}

  @Get('mouvements')
  @ApiOperation({ summary: 'Liste des mouvements de caisse' })
  @ApiQuery({ name: 'type', required: false, enum: ['ENTREE', 'SORTIE'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.caisseService.findAll({ type, search, page, limit });
  }

  @Get('solde')
  @ApiOperation({ summary: 'Solde actuel de la caisse' })
  getSolde() {
    return this.caisseService.getSolde();
  }

  @Post('mouvements')
  @ApiOperation({ summary: 'Créer un mouvement de caisse' })
  create(@Body() dto: CreateMouvementCaisseDto) {
    return this.caisseService.create(dto);
  }

  @Delete('mouvements/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un mouvement de caisse' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.caisseService.remove(id);
  }
}
