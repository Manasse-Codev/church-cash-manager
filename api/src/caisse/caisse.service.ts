import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMouvementCaisseDto } from './dto/create-mouvement.dto';

@Injectable()
export class CaisseService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { type?: string; search?: string; page?: number; limit?: number }) {
    const { type, search, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type === 'ENTREE' || type === 'SORTIE') {
      where.type = type;
    }
    if (search) {
      where.motif = { contains: search, mode: 'insensitive' };
    }

    const [mouvements, total] = await Promise.all([
      this.prisma.mouvementCaisse.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.mouvementCaisse.count({ where }),
    ]);

    // Formater pour le frontend
    const data = mouvements.map((m) => ({
      id: m.id,
      date: this.formatDate(m.date),
      motif: m.motif,
      montant: m.type === 'SORTIE' ? -m.montant : m.montant,
      type: m.type === 'ENTREE' ? 'entrée' : 'sortie',
      par: m.par,
      note: m.note,
    }));

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(dto: CreateMouvementCaisseDto) {
    const mouvement = await this.prisma.mouvementCaisse.create({
      data: {
        date: new Date(dto.date),
        motif: dto.motif.trim(),
        montant: Math.abs(dto.montant),
        type: dto.type,
        par: dto.par.trim(),
        note: dto.note,
      },
    });

    return {
      id: mouvement.id,
      date: this.formatDate(mouvement.date),
      motif: mouvement.motif,
      montant: mouvement.type === 'SORTIE' ? -mouvement.montant : mouvement.montant,
      type: mouvement.type === 'ENTREE' ? 'entrée' : 'sortie',
      par: mouvement.par,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.mouvementCaisse.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Mouvement #${id} introuvable`);
    }
    await this.prisma.mouvementCaisse.delete({ where: { id } });
    return { message: 'Mouvement supprimé avec succès' };
  }

  async getSolde(): Promise<{ solde: number; totalEntrees: number; totalSorties: number }> {
    const result = await this.prisma.mouvementCaisse.groupBy({
      by: ['type'],
      _sum: { montant: true },
    });

    const entrees = result.find((r) => r.type === 'ENTREE')?._sum.montant ?? 0;
    const sorties = result.find((r) => r.type === 'SORTIE')?._sum.montant ?? 0;

    return {
      solde: entrees - sorties,
      totalEntrees: entrees,
      totalSorties: sorties,
    };
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
