import type {
  Transaction,
  Membre,
  Investisseur,
  DepenseConstruction,
  Departement,
  CategorieColor,
} from "../types";

// ── Couleurs par catégorie ─────────────────────
export const CATEGORIE_COLORS: Record<string, CategorieColor> = {
  Ancien:      { bg: "#EEF3FF", text: "#1B3FA6" },
  Diacre:      { bg: "#DCFCE7", text: "#16A34A" },
  Membre:      { bg: "#FDF3D9", text: "#92660A" },
  Bienfaiteur: { bg: "#F3E8FF", text: "#7C3AED" },
  Jeunesse:    { bg: "#E0F2FE", text: "#0369A1" },
};

export const CATEGORIE_LIST = ["Tous", "Ancien", "Diacre", "Membre", "Bienfaiteur"];

// ── Transactions Caisse ────────────────────────
export const TRANSACTIONS: Transaction[] = [
  { id: 1,  date: "06 Jul 2026", motif: "Offrande du dimanche",            montant:  385000, type: "entrée", par: "Frère Kouadio"  },
  { id: 2,  date: "05 Jul 2026", motif: "Achat mobilier pasteur",          montant:  -85000, type: "sortie", par: "Admin"          },
  { id: 3,  date: "03 Jul 2026", motif: "Dîme mensuelle – Section Femmes", montant:   95000, type: "entrée", par: "Sœur Konan"     },
  { id: 4,  date: "02 Jul 2026", motif: "Électricité – Mois de juin",      montant:  -42000, type: "sortie", par: "Admin"          },
  { id: 5,  date: "01 Jul 2026", motif: "Offrande spéciale construction",  montant:  250000, type: "entrée", par: "Diacre Diomandé" },
  { id: 6,  date: "28 Jun 2026", motif: "Eau – Mois de juin",              montant:  -18000, type: "sortie", par: "Admin"          },
  { id: 7,  date: "25 Jun 2026", motif: "Don famille Touré",               montant:  500000, type: "entrée", par: "Frère Touré"    },
  { id: 8,  date: "22 Jun 2026", motif: "Achat papeterie",                 montant:  -15000, type: "sortie", par: "Admin"          },
  { id: 9,  date: "20 Jun 2026", motif: "Quête du mercredi",               montant:   78000, type: "entrée", par: "Frère Yao"      },
  { id: 10, date: "15 Jun 2026", motif: "Location sono – Conférence",      montant:  -35000, type: "sortie", par: "Admin"          },
];

// ── Membres ────────────────────────────────────
export const MEMBRES: Membre[] = [
  { id: 1, nom: "Kouadio",  prénom: "Emmanuel",     catégorie: "Ancien",      téléphone: "+225 07 01 23 45 67", date: "12 Jan 2019" },
  { id: 2, nom: "Konan",    prénom: "Marie-Thérèse", catégorie: "Membre",     téléphone: "+225 05 98 76 54 32", date: "03 Mar 2021" },
  { id: 3, nom: "Diomandé", prénom: "Joseph",        catégorie: "Diacre",     téléphone: "+225 07 45 67 89 01", date: "07 Jul 2015" },
  { id: 4, nom: "Yao",      prénom: "Paul",          catégorie: "Membre",     téléphone: "+225 05 32 10 98 76", date: "22 Sep 2022" },
  { id: 5, nom: "Ngoran",   prénom: "Cécile",        catégorie: "Membre",     téléphone: "+225 07 65 43 21 09", date: "15 Nov 2020" },
  { id: 6, nom: "Loukou",   prénom: "Pierre",        catégorie: "Diacre",     téléphone: "+225 05 11 12 22 23", date: "01 Jun 2018" },
  { id: 7, nom: "M'bah",    prénom: "Agnès",         catégorie: "Membre",     téléphone: "+225 07 33 34 44 45", date: "08 Fév 2023" },
  { id: 8, nom: "Bamba",    prénom: "Théodore",      catégorie: "Bienfaiteur",téléphone: "+225 05 55 56 66 67", date: "30 Avr 2016" },
];

// ── Investisseurs ──────────────────────────────
export const INVESTISSEURS: Investisseur[] = [
  { id: 1, nom: "Frère Emmanuel Kouadio",    categorie: "Ancien",      promesse: 500000,  payé: 350000,  paiements: [{ date: "05 Mar 2026", montant: 200000, méthode: "Mobile Money" }, { date: "10 Mai 2026", montant: 150000, méthode: "Espèces" }] },
  { id: 2, nom: "Sœur Marie-Thérèse Konan",  categorie: "Membre",      promesse: 300000,  payé: 300000,  paiements: [{ date: "01 Fév 2026", montant: 150000, méthode: "Virement" }, { date: "01 Avr 2026", montant: 150000, méthode: "Mobile Money" }] },
  { id: 3, nom: "Diacre Joseph Diomandé",    categorie: "Diacre",      promesse: 750000,  payé: 200000,  paiements: [{ date: "15 Jan 2026", montant: 200000, méthode: "Espèces" }] },
  { id: 4, nom: "Frère Paul Yao",            categorie: "Membre",      promesse: 150000,  payé: 50000,   paiements: [{ date: "20 Jun 2026", montant: 50000, méthode: "Mobile Money" }] },
  { id: 5, nom: "Famille Touré-Kouassi",     categorie: "Bienfaiteur", promesse: 2000000, payé: 1500000, paiements: [{ date: "01 Jan 2026", montant: 500000, méthode: "Virement" }, { date: "01 Mar 2026", montant: 500000, méthode: "Virement" }, { date: "01 Jun 2026", montant: 500000, méthode: "Virement" }] },
];

// ── Construction ───────────────────────────────
export const BUDGET_CONSTRUCTION = 25_000_000;

export const DEPENSES_CONSTRUCTION: DepenseConstruction[] = [
  { id: 1, date: "04 Jul 2026", article: "Sacs de ciment (200 sacs)",    montant: 480000, fournisseur: "SCIMAF Abidjan",          categorie: "Matériaux"    },
  { id: 2, date: "01 Jul 2026", article: "Ferraillage – lot 3",          montant: 350000, fournisseur: "Sotaci Côte d'Ivoire",    categorie: "Matériaux"    },
  { id: 3, date: "28 Jun 2026", article: "Main d'œuvre – semaine 12",   montant: 240000, fournisseur: "Équipe Maître Koffi",      categorie: "Main d'œuvre" },
  { id: 4, date: "22 Jun 2026", article: "Sable et gravier (10 m³)",    montant: 180000, fournisseur: "Carrière d'Akandjé",       categorie: "Matériaux"    },
  { id: 5, date: "20 Jun 2026", article: "Planches coffrage",            montant: 95000,  fournisseur: "Scierie de San-Pédro",    categorie: "Matériaux"    },
  { id: 6, date: "15 Jun 2026", article: "Main d'œuvre – semaine 11",   montant: 240000, fournisseur: "Équipe Maître Koffi",      categorie: "Main d'œuvre" },
  { id: 7, date: "10 Jun 2026", article: "Frais architecte",             montant: 150000, fournisseur: "Cabinet Bâtir Ivoire",    categorie: "Honoraires"   },
  { id: 8, date: "05 Jun 2026", article: "Tuyauterie PVC",               montant: 72000,  fournisseur: "Quincaillerie Centrale",   categorie: "Plomberie"    },
];

// ── Départements ───────────────────────────────
export const DEPARTEMENTS: Departement[] = [
  { id: 1, nom: "Chœur",          description: "Louange & Adoration",  icon: "Music",  color: "#1B3FA6", bg: "#EEF3FF", budget: 500000, depense: 310000, membres: 24, transactions: [{ date: "02 Jul 2026", motif: "Achat robes de chœur",    montant: -85000 }, { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 150000 }] },
  { id: 2, nom: "Jeunesse",       description: "18 – 35 ans",          icon: "Users",  color: "#16A34A", bg: "#DCFCE7", budget: 800000, depense: 420000, membres: 48, transactions: [{ date: "01 Jul 2026", motif: "Camp jeunesse – acompte", montant: -200000 }, { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 200000 }] },
  { id: 3, nom: "Femmes",         description: "Section féminine",     icon: "Heart",  color: "#7C3AED", bg: "#F3E8FF", budget: 600000, depense: 280000, membres: 62, transactions: [{ date: "03 Jul 2026", motif: "Réunion mensuelle",      montant: -45000  }, { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 150000 }] },
  { id: 4, nom: "Enfants",        description: "École du Dimanche",    icon: "Baby",   color: "#D97706", bg: "#FEF3C7", budget: 400000, depense: 185000, membres: 35, transactions: [{ date: "06 Jul 2026", motif: "Matériel pédagogique",   montant: -35000  }, { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 100000 }] },
  { id: 5, nom: "Évangélisation", description: "Mission & Évangile",   icon: "Book",   color: "#0369A1", bg: "#E0F2FE", budget: 700000, depense: 520000, membres: 18, transactions: [{ date: "04 Jul 2026", motif: "Tracts et Bibles",       montant: -120000 }, { date: "10 Jun 2026", motif: "Dotation mensuelle", montant: 200000 }] },
  { id: 6, nom: "Anciens",        description: "Conseil des anciens",  icon: "Shield", color: "#475569", bg: "#F1F5F9", budget: 300000, depense: 90000,  membres: 8,  transactions: [{ date: "10 Jun 2026", motif: "Dotation mensuelle",    montant: 100000  }, { date: "20 Jun 2026", motif: "Repas conseil",       montant: -10000 }] },
];

// ── Chart data Dashboard ───────────────────────
export const CHART_DATA = [
  { mois: "Jan", entrées: 850000,  dépenses: 320000 },
  { mois: "Fév", entrées: 1200000, dépenses: 480000 },
  { mois: "Mar", entrées: 980000,  dépenses: 560000 },
  { mois: "Avr", entrées: 1450000, dépenses: 390000 },
  { mois: "Mai", entrées: 1100000, dépenses: 620000 },
  { mois: "Jun", entrées: 1380000, dépenses: 450000 },
];
