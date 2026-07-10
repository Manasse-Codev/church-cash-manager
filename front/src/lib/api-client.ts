/**
 * Client API — Préparation pour le futur backend NestJS.
 *
 * Ce module centralise tous les appels HTTP vers l'API.
 * Pour l'instant, les données sont mockées dans `constants/mockData.ts`.
 * Quand le backend sera prêt, il suffira de remplacer les fonctions
 * exportées par des appels fetch réels sans toucher aux composants.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

/**
 * Fetch wrapper avec gestion automatique du token JWT.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("auth-token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token invalide ou expiré — redirection vers la connexion
    localStorage.removeItem("auth-token");
    window.location.href = "/connexion";
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? `Erreur serveur (${response.status})`
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json();
}

// ── Méthodes utilitaires ─────────────────────

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
