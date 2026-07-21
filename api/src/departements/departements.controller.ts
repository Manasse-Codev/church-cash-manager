import {
  Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartementsService } from './departements.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { CreateMouvementDepartementDto } from './dto/create-mouvement-departement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('departements')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('departements')
export class DepartementsController {
  constructor(private readonly departementsService: DepartementsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste de tous les départements avec mouvements récents' })
  findAll() {
    return this.departementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un département avec son grand livre complet' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departementsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau département' })
  create(@Body() dto: CreateDepartementDto) {
    return this.departementsService.create(dto);
  }

  @Post(':id/mouvements')
  @ApiOperation({ summary: 'Ajouter une écriture (mouvement) dans le grand livre d\'un département' })
  addMouvement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMouvementDepartementDto,
  ) {
    return this.departementsService.addMouvement(id, dto);
  }
}
