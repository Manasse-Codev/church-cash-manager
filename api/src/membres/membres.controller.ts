import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, HttpCode, HttpStatus, Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MembresService } from './membres.service';
import { CreateMembreDto } from './dto/create-membre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('membres')
@Controller('membres')
export class MembresController {
  constructor(private readonly membresService: MembresService) {}

  // ── Routes d'administration (Protégées par JWT) ───────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Liste des membres avec filtres' })
  @ApiQuery({ name: 'categorie', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('categorie') categorie?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.membresService.findAll({ categorie, search, page, limit });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer un membre' })
  create(@Body() dto: CreateMembreDto) {
    return this.membresService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un membre' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membresService.remove(id);
  }

  @Get('form-config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer la configuration du formulaire d\'inscription' })
  getFormConfig() {
    return this.membresService.getFormConfig();
  }

  @Put('form-config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour la configuration du formulaire d\'inscription' })
  updateFormConfig(@Body('champs') champs: unknown[]) {
    return this.membresService.updateFormConfig(champs);
  }

  // ── Routes publiques (Sans authentification) ──────────────────────────────

  @Get('form-config/public/:token')
  @ApiOperation({ summary: 'Récupérer la configuration publique du formulaire par token' })
  getPublicConfig(@Param('token') token: string) {
    return this.membresService.getFormConfigByToken(token);
  }

  @Post('public/:token')
  @ApiOperation({ summary: 'Inscription publique d\'un membre' })
  publicInscription(
    @Param('token') token: string,
    @Body() dto: CreateMembreDto,
  ) {
    return this.membresService.inscriptionPublique(token, dto);
  }
}
