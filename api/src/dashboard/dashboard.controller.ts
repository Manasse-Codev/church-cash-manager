import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les indicateurs clés pour le tableau de bord' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('chart')
  @ApiOperation({ summary: 'Obtenir les données du graphique Entrées vs Dépenses' })
  getChartData() {
    return this.dashboardService.getChartData();
  }
}
