import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

type PersistedAuthState = Pick<AuthState, "token" | "user">;

const authStorage: PersistStorage<PersistedAuthState> = {
  getItem: (name) => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const value = window.localStorage.getItem(name);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as StorageValue<PersistedAuthState>;
    } catch {
      window.localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(name, JSON.stringify(value));
    } catch {
      window.localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(name);
  },
};

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
      storage: authStorage,
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
