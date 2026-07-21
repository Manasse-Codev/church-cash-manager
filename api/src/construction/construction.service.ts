import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepenseConstructionDto } from './dto/create-depense.dto';

@Injectable()
export class ConstructionService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { search?: string; categorie?: string }) {
    const { search, categorie } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { article: { contains: search, mode: 'insensitive' } },
        { fournisseur: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categorie) {
      where.categorie = categorie;
    }

    const depenses = await this.prisma.depenseConstruction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return depenses.map((d) => ({
      id: d.id,
      date: d.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      article: d.article,
      montant: d.montant,
      fournisseur: d.fournisseur,
      categorie: d.categorie,
      note: d.note,
    }));
  }

  async getStats() {
    const [budget, depenseResult] = await Promise.all([
      this.prisma.budgetConstruction.findUnique({ where: { id: 1 } }),
      this.prisma.depenseConstruction.aggregate({ _sum: { montant: true } }),
    ]);

    const budgetTotal = budget?.montant ?? 25_000_000;
    const totalDepense = depenseResult._sum.montant ?? 0;

    return {
      budgetTotal,
      totalDepense,
      budgetRestant: budgetTotal - totalDepense,
      pourcentage: budgetTotal > 0 ? Math.round((totalDepense / budgetTotal) * 100) : 0,
    };
  }

  async create(dto: CreateDepenseConstructionDto) {
    const depense = await this.prisma.depenseConstruction.create({
      data: {
        date: new Date(dto.date),
        article: dto.article.trim(),
        montant: dto.montant,
        fournisseur: dto.fournisseur.trim(),
        categorie: dto.categorie,
        note: dto.note,
      },
    });

    return {
      id: depense.id,
      date: depense.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      article: depense.article,
      montant: depense.montant,
      fournisseur: depense.fournisseur,
      categorie: depense.categorie,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.depenseConstruction.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Dépense #${id} introuvable`);
    await this.prisma.depenseConstruction.delete({ where: { id } });
    return { message: 'Dépense supprimée avec succès' };
  }

  async updateBudget(montant: number) {
    return this.prisma.budgetConstruction.upsert({
      where: { id: 1 },
      update: { montant },
      create: { id: 1, montant },
    });
  }
}
