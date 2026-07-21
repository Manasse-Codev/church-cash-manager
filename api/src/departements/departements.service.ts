import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { CreateMouvementDepartementDto } from './dto/create-mouvement-departement.dto';

@Injectable()
export class DepartementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const departements = await this.prisma.departement.findMany({
      include: {
        mouvements: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
      orderBy: { nom: 'asc' },
    });

    return departements.map((d) => this.formatDepartement(d));
  }

  async findOne(id: number) {
    const dept = await this.prisma.departement.findUnique({
      where: { id },
      include: {
        mouvements: { orderBy: { date: 'desc' } },
      },
    });

    if (!dept) throw new NotFoundException(`Département #${id} introuvable`);
    return this.formatDepartement(dept);
  }

  async create(dto: CreateDepartementDto) {
    const dept = await this.prisma.departement.create({
      data: {
        nom: dto.nom.trim(),
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        bg: dto.bg,
        budget: dto.budget,
        membres: dto.membres ?? 0,
      },
      include: { mouvements: true },
    });
    return this.formatDepartement(dept);
  }

  async addMouvement(departementId: number, dto: CreateMouvementDepartementDto) {
    const dept = await this.prisma.departement.findUnique({ where: { id: departementId } });
    if (!dept) throw new NotFoundException(`Département #${departementId} introuvable`);

    await this.prisma.mouvementDepartement.create({
      data: {
        departementId,
        date: new Date(dto.date),
        motif: dto.motif.trim(),
        montant: dto.montant,
        note: dto.note,
      },
    });

    return this.findOne(departementId);
  }

  private formatDepartement(dept: any) {
    const depense = dept.mouvements
      .filter((m: any) => m.montant < 0)
      .reduce((s: number, m: any) => s + Math.abs(m.montant), 0);

    return {
      id: dept.id,
      nom: dept.nom,
      description: dept.description,
      icon: dept.icon,
      color: dept.color,
      bg: dept.bg,
      budget: dept.budget,
      depense,
      membres: dept.membres,
      transactions: dept.mouvements.map((m: any) => ({
        id: m.id,
        date: m.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        motif: m.motif,
        montant: m.montant,
      })),
    };
  }
}
