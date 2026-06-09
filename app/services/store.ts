import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  username: string;
  role: "master" | "admin" | "directivo" | "player";
}

interface AuthStore {
  hydrated: boolean;

  token: string | null;

  user: User | null;

  setHydrated: (value: boolean) => void;

  setAuth: (token: string, user: User) => void;

  logout: () => void;

  hasRole: (roles: User["role"][]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      hydrated: false,

      token: null,

      user: null,

      setHydrated: (value) =>
        set({
          hydrated: value,
        }),

      setAuth: (token, user) =>
        set({
          token,
          user,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
        }),

      hasRole: (roles) => {
        const role = get().user?.role;

        return role ? roles.includes(role) : false;
      },
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
