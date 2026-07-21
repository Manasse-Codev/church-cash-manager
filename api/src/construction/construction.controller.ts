import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, HttpCode, HttpStatus, Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConstructionService } from './construction.service';
import { CreateDepenseConstructionDto } from './dto/create-depense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('construction')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('construction')
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @Get('depenses')
  @ApiOperation({ summary: 'Liste des dépenses du chantier' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categorie', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('categorie') categorie?: string,
  ) {
    return this.constructionService.findAll({ search, categorie });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Indicateurs budgétaires du chantier' })
  getStats() {
    return this.constructionService.getStats();
  }

  @Post('depenses')
  @ApiOperation({ summary: 'Enregistrer une nouvelle dépense' })
  create(@Body() dto: CreateDepenseConstructionDto) {
    return this.constructionService.create(dto);
  }

  @Put('budget')
  @ApiOperation({ summary: 'Mettre à jour le budget global de construction' })
  updateBudget(@Body('montant') montant: number) {
    return this.constructionService.updateBudget(montant);
  }

  @Delete('depenses/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une dépense' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.constructionService.remove(id);
  }
}
