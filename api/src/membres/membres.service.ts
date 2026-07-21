import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMembreDto } from './dto/create-membre.dto';

@Injectable()
export class MembresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { categorie?: string; search?: string; page?: number; limit?: number }) {
    const { categorie, search, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categorie && categorie !== 'Tous') {
      where.categorie = categorie;
    }
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { telephone: { contains: search } },
      ];
    }

    const [membres, total] = await Promise.all([
      this.prisma.membre.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.membre.count({ where }),
    ]);

    return {
      data: membres.map((m) => this.formatMembre(m)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(dto: CreateMembreDto) {
    const membre = await this.prisma.membre.create({
      data: {
        nom: dto.nom.trim(),
        prenom: dto.prenom.trim(),
        categorie: dto.categorie,
        telephone: dto.telephone.trim(),
        champsDynamiques: (dto.champsDynamiques as any) ?? undefined,
      },
    });
    return this.formatMembre(membre);
  }

  async remove(id: number) {
    const existing = await this.prisma.membre.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Membre #${id} introuvable`);
    await this.prisma.membre.delete({ where: { id } });
    return { message: 'Membre supprimé avec succès' };
  }

  // ── Formulaire public ─────────────────────────────────────────────────────

  async getFormConfig() {
    let config = await this.prisma.membreFormConfig.findUnique({ where: { id: 1 } });

    // Créer une config par défaut si inexistante
    if (!config) {
      config = await this.prisma.membreFormConfig.create({
        data: {
          id: 1,
          champs: [
            { label: 'Nom', type: 'text', required: true },
            { label: 'Prénom', type: 'text', required: true },
            { label: 'Téléphone', type: 'tel', required: true },
            { label: 'Catégorie', type: 'select', required: true },
          ],
        },
      });
    }

    return config;
  }

  async updateFormConfig(champs: unknown[]) {
    return this.prisma.membreFormConfig.upsert({
      where: { id: 1 },
      update: { champs: champs as any },
      create: { id: 1, champs: champs as any },
    });
  }

  async getFormConfigByToken(token: string) {
    const config = await this.prisma.membreFormConfig.findUnique({
      where: { linkToken: token },
    });
    if (!config) throw new NotFoundException('Lien d\'inscription invalide ou expiré');
    return config;
  }

  async inscriptionPublique(token: string, dto: CreateMembreDto) {
    // Vérifier que le token est valide
    await this.getFormConfigByToken(token);

    return this.create(dto);
  }

  private formatMembre(m: any) {
    return {
      id: m.id,
      nom: m.nom,
      prénom: m.prenom,
      catégorie: m.categorie,
      téléphone: m.telephone,
      date: m.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      champsDynamiques: m.champsDynamiques,
    };
  }
}
