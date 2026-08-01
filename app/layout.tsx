import "./globals.css";

import { AuthProvider, Providers } from "@/components/layout/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

// project/
// ├── app/
// ├──├──(admin)/
// ├──├──(login)/
// ├──├──(usuarios)/
// ├──├──components/
// ├──ervices/
// ├──global.css
// ├──layout.tsx
// |--|not-found.tsx
// ├──├──page.tsx
// ├── tsconfig.json
// ├──next.config.ts
// ├──postcss.config.mjs
