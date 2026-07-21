import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            errorBody?.message ?? "Email ou mot de passe incorrect."
          );
        }

        const data = await response.json();
        const { access_token, user } = data.data; // Le backend NestJS enveloppe la réponse dans un champ "data" via TransformInterceptor

        // Enregistrer le token dans localStorage pour les futurs appels d'API
        localStorage.setItem("auth-token", access_token);

        // Mettre à jour le store
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("auth-token");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "ad-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
