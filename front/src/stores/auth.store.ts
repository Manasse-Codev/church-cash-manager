import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "../types";

// Utilisateurs mock (en prod : remplacer par appel API)
const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@eglise.cg": {
    id: "1",
    nom: "Admin",
    email: "admin@eglise.cg",
    role: "admin",
    password: "admin123",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulation d'un délai réseau
        await new Promise((r) => setTimeout(r, 800));

        const found = MOCK_USERS[email.toLowerCase()];
        if (!found || found.password !== password) {
          throw new Error("Email ou mot de passe incorrect.");
        }

        const { password: _pw, ...user } = found;
        set({ user, isAuthenticated: true });
      },

      logout: () => set({ user: null, isAuthenticated: false }),
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
