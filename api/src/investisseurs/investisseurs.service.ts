import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestisseurDto } from './dto/create-investisseur.dto';
import { CreateVersementDto } from './dto/create-versement.dto';

@Injectable()
export class InvestisseursService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { categorie?: string; search?: string }) {
    const { categorie, search } = query;

    const where: any = {};
    if (categorie && categorie !== 'Tous') {
      where.categorie = categorie;
    }
    if (search) {
      where.nom = { contains: search, mode: 'insensitive' };
    }

    const investisseurs = await this.prisma.investisseur.findMany({
      where,
      include: { versements: { orderBy: { date: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return investisseurs.map((inv) => this.formatInvestisseur(inv));
  }

  async findOne(id: number) {
    const inv = await this.prisma.investisseur.findUnique({
      where: { id },
      include: { versements: { orderBy: { date: 'desc' } } },
    });

    if (!inv) throw new NotFoundException(`Investisseur #${id} introuvable`);
    return this.formatInvestisseur(inv);
  }

  async create(dto: CreateInvestisseurDto) {
    const inv = await this.prisma.investisseur.create({
      data: {
        nom: dto.nom.trim(),
        categorie: dto.categorie,
        promesse: dto.promesse,
        note: dto.note,
      },
      include: { versements: true },
    });
    return this.formatInvestisseur(inv);
  }

  async remove(id: number) {
    const existing = await this.prisma.investisseur.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Investisseur #${id} introuvable`);
    await this.prisma.investisseur.delete({ where: { id } });
    return { message: 'Investisseur supprimé avec succès' };
  }

  async addVersement(investisseurId: number, dto: CreateVersementDto) {
    const inv = await this.prisma.investisseur.findUnique({ where: { id: investisseurId } });
    if (!inv) throw new NotFoundException(`Investisseur #${investisseurId} introuvable`);

    await this.prisma.versementInvestisseur.create({
      data: {
        investisseurId,
        date: new Date(dto.date),
        montant: dto.montant,
        methode: dto.methode,
        note: dto.note,
      },
    });

    // Retourner l'investisseur mis à jour
    return this.findOne(investisseurId);
  }

  private formatInvestisseur(inv: any) {
    const paye = inv.versements.reduce((s: number, v: any) => s + v.montant, 0);
    return {
      id: inv.id,
      nom: inv.nom,
      categorie: inv.categorie,
      promesse: inv.promesse,
      payé: paye,
      note: inv.note,
      paiements: inv.versements.map((v: any) => ({
        id: v.id,
        date: v.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        montant: v.montant,
        méthode: v.methode,
        note: v.note,
      })),
    };
  }
}
