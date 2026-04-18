"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "90s", seconds: 90 },
  { label: "2:00", seconds: 120 },
  { label: "3:00", seconds: 180 },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

function vibrateDone() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate([250, 120, 250, 120, 500]);
  }
}

export function RestTimer() {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    if (endAt == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [endAt]);

  const remaining =
    endAt == null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));
  const active = endAt != null && remaining > 0;

  useEffect(() => {
    if (endAt != null && remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      vibrateDone();
      const t = window.setTimeout(() => {
        setEndAt(null);
      }, 1500);
      return () => window.clearTimeout(t);
    }
    if (endAt != null && remaining > 0) {
      firedRef.current = false;
    }
  }, [endAt, remaining]);

  const start = (seconds: number) => {
    firedRef.current = false;
    setEndAt(Date.now() + seconds * 1000);
    setNow(Date.now());
  };

  const stop = () => {
    setEndAt(null);
    firedRef.current = false;
  };

  const done = endAt != null && remaining === 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 ${
        active
          ? "border-beast-accent bg-beast-accent text-black"
          : done
            ? "border-beast-good bg-beast-good text-black"
            : "border-beast-accent bg-black text-beast-ink"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-xl px-3 py-3">
        {active ? (
          <div className="flex items-center gap-3">
            <div className="font-display text-xs tracking-widest">REST</div>
            <div className="flex-1 font-mono text-4xl leading-none tabular-nums">
              {fmt(remaining)}
            </div>
            <button
              onClick={stop}
              className="h-12 min-w-[80px] border-2 border-black bg-black px-3 font-display text-sm text-beast-accent active:translate-y-[1px]"
            >
              STOP
            </button>
          </div>
        ) : done ? (
          <div className="flex items-center gap-3">
            <div className="font-display text-lg">GO</div>
            <div className="flex-1 font-mono text-xl">REST COMPLETE</div>
            <button
              onClick={stop}
              className="h-12 min-w-[80px] border-2 border-black bg-black px-3 font-display text-sm text-beast-good active:translate-y-[1px]"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="flex items-stretch gap-2">
            <div className="flex items-center px-1 font-display text-xs tracking-widest text-beast-mute">
              REST
            </div>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => start(p.seconds)}
                className="h-14 flex-1 border-2 border-beast-line bg-black font-display text-lg text-beast-ink active:bg-beast-accent active:text-black active:translate-y-[1px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
