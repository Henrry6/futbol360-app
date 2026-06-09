"use client";

import { useAuthStore } from "@/services/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
