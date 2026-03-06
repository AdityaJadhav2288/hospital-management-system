import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,
      token: null,
      user: null,
      setHydrated: (hydrated) => set({ hydrated }),
      setSession: (token, user) => set({ token, user, hydrated: true }),
      clearSession: () => set({ token: null, user: null, hydrated: true }),
    }),
    {
      name: "hms-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
