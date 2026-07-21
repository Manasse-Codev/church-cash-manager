import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvestisseursService } from './investisseurs.service';
import { CreateInvestisseurDto } from './dto/create-investisseur.dto';
import { CreateVersementDto } from './dto/create-versement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('investisseurs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('investisseurs')
export class InvestisseursController {
  constructor(private readonly investisseursService: InvestisseursService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des investisseurs' })
  @ApiQuery({ name: 'categorie', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('categorie') categorie?: string,
    @Query('search') search?: string,
  ) {
    return this.investisseursService.findAll({ categorie, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un investisseur avec historique' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.investisseursService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un investisseur' })
  create(@Body() dto: CreateInvestisseurDto) {
    return this.investisseursService.create(dto);
  }

  @Post(':id/versements')
  @ApiOperation({ summary: 'Ajouter un versement à un investisseur' })
  addVersement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateVersementDto,
  ) {
    return this.investisseursService.addVersement(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un investisseur' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.investisseursService.remove(id);
  }
}
