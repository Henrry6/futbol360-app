// components/MatchMinuteCounter.tsx
"use client";

import { useEffect, useState } from "react";

interface MatchMinuteCounterProps {
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  status?: string; // "borrador" | "en_juego" | "finalizada" | "suspendido"
  size?: "small" | "default" | "large";
}

const SIZE_CLASSES: Record<
  NonNullable<MatchMinuteCounterProps["size"]>,
  { text: string; dot: string }
> = {
  small: { text: "text-xs", dot: "w-1.5 h-1.5" },
  default: { text: "text-base", dot: "w-2 h-2" },
  large: { text: "text-3xl", dot: "w-3 h-3" },
};

export function ContadorMinutos({
  startTime,
  endTime,
  status,
  size = "default",
}: MatchMinuteCounterProps) {
  const [now, setNow] = useState(() => Date.now());

  const isRunning =
    !!startTime &&
    !endTime &&
    status !== "finalizada" &&
    status !== "suspendido";

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 15000); // refresca cada 15s
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!startTime) return null;

  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : now;
  const minutes = Math.max(0, Math.floor((end - start) / 60000));
  const { text, dot } = SIZE_CLASSES[size];

  return (
    <span className={`font-mono font-semibold flex items-center gap-1 ${text}`}>
      {isRunning && (
        <span
          className={`inline-block rounded-full bg-red-500 animate-pulse ${dot}`}
          aria-label="en vivo"
        />
      )}
      {minutes}&apos;
    </span>
  );
}
