import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitaire de fusion de classes Tailwind CSS.
 * Combine clsx (conditions) + tailwind-merge (résolution des conflits).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre en devise FCFA.
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}

/**
 * Formate un nombre en version abrégée pour l'affichage.
 */
export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(".0", "") + "M";
  }
  if (Math.abs(amount) >= 1_000) {
    return (amount / 1_000).toFixed(0) + "k";
  }
  return amount.toString();
}
