
// ── Transactions ──────────────────────────────
export interface Transaction {
  id: number;
  date: string;
  motif: string;
  montant: number;
  type: "entrée" | "sortie";
  par: string;
  note?: string;
}

// ── Membres ───────────────────────────────────
export type CategorieMembre = "Ancien" | "Diacre" | "Membre" | "Bienfaiteur" | "Jeunesse";

export interface Membre {
  id: number;
  nom: string;
  prénom: string;
  catégorie: CategorieMembre;
  téléphone: string;
  date: string;
}

// ── Investisseurs ─────────────────────────────
export interface Paiement {
  date: string;
  montant: number;
  méthode: "Mobile Money" | "Espèces" | "Virement" | "Virement bancaire" | "Chèque";
}

export interface Investisseur {
  id: number;
  nom: string;
  categorie: string;
  promesse: number;
  payé: number;
  paiements: Paiement[];
}

// ── Construction ──────────────────────────────
export interface DepenseConstruction {
  id: number;
  date: string;
  article: string;
  montant: number;
  fournisseur: string;
  categorie: "Matériaux" | "Main d'œuvre" | "Honoraires" | "Plomberie" | "Autre";
}

// ── Départements ──────────────────────────────
export interface DeptTransaction {
  date: string;
  motif: string;
  montant: number;
}

export interface Departement {
  id: number;
  nom: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  budget: number;
  depense: number;
  membres: number;
  transactions: DeptTransaction[];
}

// ── Auth ──────────────────────────────────────
export interface User {
  id: string;
  nom: string;
  email: string;
  role: "admin" | "trésorier" | "lecteur";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── UI ────────────────────────────────────────
export interface CategorieColor {
  bg: string;
  text: string;
}

export type TabCaisse = "Tout" | "Entrées" | "Sorties";
