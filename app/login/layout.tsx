export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Imagen fondo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Contenido */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
}
