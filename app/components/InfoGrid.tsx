import React from "react";

interface InfoItem {
  label: React.ReactNode;
  value: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
}

interface InfoGridProps {
  items: InfoItem[];
  /**
   * Número máximo de columnas en pantallas grandes.
   * En móviles siempre será 1 columna.
   */
  columns?: 1 | 2 | 3 | 4;
}

export default function InfoGrid({ items, columns = 3 }: InfoGridProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  }[columns];

  const spanClass = (span?: number) => {
    switch (span) {
      case 2:
        return columns >= 2 ? "sm:col-span-2" : "";
      case 3:
        return columns >= 3 ? "xl:col-span-3 sm:col-span-2" : "";
      case 4:
        return columns >= 4 ? "2xl:col-span-4 lg:col-span-3 sm:col-span-2" : "";
      default:
        return "";
    }
  };

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`rounded-lg border bg-white p-4 ${spanClass(item.span)}`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {item.label}
          </div>

          <div className="mt-1 break-words font-medium">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
