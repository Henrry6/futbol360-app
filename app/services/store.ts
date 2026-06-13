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

  loginType: "admin" | "user" | null;

  isAdmin: boolean;

  setHydrated: (value: boolean) => void;

  setAuth: (token: string, user: User, loginType: "admin" | "user") => void;

  logout: () => void;

  hasRole: (roles: User["role"][]) => boolean;
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
          isAdmin: user.role === "master",
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          loginType: null,
          isAdmin: false,
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
