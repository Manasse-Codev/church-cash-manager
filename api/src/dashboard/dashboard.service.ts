import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Exécuter toutes les requêtes en parallèle
    const [
      caisseResult,
      investisseurs,
      depensesConstruction,
      budgetConstructionDb,
      totalMembres,
    ] = await Promise.all([
      this.prisma.mouvementCaisse.groupBy({
        by: ['type'],
        _sum: { montant: true },
      }),
      this.prisma.investisseur.findMany({
        include: { versements: { select: { montant: true } } },
      }),
      this.prisma.depenseConstruction.aggregate({ _sum: { montant: true } }),
      this.prisma.budgetConstruction.findUnique({ where: { id: 1 } }),
      this.prisma.membre.count(),
    ]);

    // Calculs caisse
    const entrees = caisseResult.find((r) => r.type === 'ENTREE')?._sum.montant ?? 0;
    const sorties = caisseResult.find((r) => r.type === 'SORTIE')?._sum.montant ?? 0;
    const soldeCaisse = entrees - sorties;

    // Calculs investisseurs
    const totalPromesses = investisseurs.reduce((s, i) => s + i.promesse, 0);
    const totalVerse = investisseurs.reduce(
      (s, i) => s + i.versements.reduce((vs, v) => vs + v.montant, 0),
      0,
    );

    // Construction
    const totalDepensesConstruction = depensesConstruction._sum.montant ?? 0;
    const budgetConstruction = budgetConstructionDb?.montant ?? 25_000_000;

    return {
      soldeCaisse,
      totalEntrees: entrees,
      totalSorties: sorties,
      fondsConstruction: totalVerse,
      totalPromesses,
      resteAPayerConstruction: totalPromesses - totalVerse,
      totalDepensesConstruction,
      budgetConstruction,
      totalMembres,
    };
  }

  async getChartData() {
    // Données des 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const mouvements = await this.prisma.mouvementCaisse.findMany({
      where: { date: { gte: sixMonthsAgo } },
      select: { date: true, montant: true, type: true },
      orderBy: { date: 'asc' },
    });

    // Grouper par mois
    const moisMap = new Map<string, { entrées: number; dépenses: number }>();

    // Initialiser les 6 derniers mois
    const MOIS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${MOIS_FR[d.getMonth()]}`;
      if (!moisMap.has(key)) {
        moisMap.set(key, { entrées: 0, dépenses: 0 });
      }
    }

    mouvements.forEach((m) => {
      const key = MOIS_FR[m.date.getMonth()];
      const entry = moisMap.get(key) ?? { entrées: 0, dépenses: 0 };
      if (m.type === 'ENTREE') {
        entry.entrées += m.montant;
      } else {
        entry.dépenses += m.montant;
      }
      moisMap.set(key, entry);
    });

    return Array.from(moisMap.entries()).map(([mois, values]) => ({
      mois,
      ...values,
    }));
  }
}
