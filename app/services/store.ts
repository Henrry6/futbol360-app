import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  roles: ("master" | "admin" | "directivo" | "player" | "official")[];
  league: string;
  nameLiga: string;
  code: string;
}

interface AuthStore {
  hydrated: boolean;
  token: string | null;
  user: User | null;
  loginType: "admin" | "user" | null;
  isAdmin: boolean;
  setHydrated: (value: boolean) => void;
  setAuth: (token: string, user: User, loginType: "admin" | "user") => void;
  logout: () => void;
  hasRole: (roles: string | string[] | User["roles"]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      token: null,
      user: null,
      loginType: null,
      isAdmin: false,

      setHydrated: (value) =>
        set({
          hydrated: value,
        }),

      setAuth: (token, user, loginType) =>
        set({
          token,
          user,
          loginType,
          isAdmin: user.roles.includes("master"),
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          loginType: null,
          isAdmin: false,
        }),

      hasRole: (roles) => {
        const userRoles = get().user?.roles;
        if (!userRoles) return false;

        const rolesToCheck = Array.isArray(roles) ? roles : [roles];

        return userRoles.some((role) => rolesToCheck.includes(role));
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
