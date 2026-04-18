"use client";

import { useEffect, useMemo, useState } from "react";
import { WORKOUTS, findWorkout } from "@/lib/workouts";
import { RestTimer } from "./components/RestTimer";

const STORAGE_KEY = "beastmode:v1";
const WRITE_DEBOUNCE_MS = 200;
const DAY_MS = 24 * 60 * 60 * 1000;

type SetLog = { weight: string; reps: string };
type Session = {
  id: string;
  day: number;
  dayCode: string;
  dayName: string;
  date: number;
  week: number;
  entries: Record<string, SetLog[]>;
};
type State = {
  version: 1;
  startDate: number;
  selectedDay: number;
  rampUp: boolean;
  drafts: Record<number, Session>;
  history: Session[];
};

type HintTone = "up" | "down" | "flat" | "info" | "none";
type Hint = { text: string; tone: HintTone };

const HINT_COLOR: Record<HintTone, string> = {
  up: "text-beast-good",
  down: "text-beast-bad",
  flat: "text-beast-ink",
  info: "text-beast-mute",
  none: "text-beast-mute",
};

function blankEntries(dayId: number): Record<string, SetLog[]> {
  const w = findWorkout(dayId);
  const entries: Record<string, SetLog[]> = {};
  w.exercises.forEach((e) => {
    entries[e.name] = Array.from({ length: e.sets }, () => ({
      weight: "",
      reps: "",
    }));
  });
  return entries;
}

function emptySession(dayId: number, startDate: number): Session {
  const w = findWorkout(dayId);
  const now = Date.now();
  return {
    id: `draft-${dayId}-${now}`,
    day: dayId,
    dayCode: w.code,
    dayName: w.name,
    date: now,
    week: weekOf(now, startDate),
    entries: blankEntries(dayId),
  };
}

function weekOf(date: number, startDate: number): number {
  const diff = Math.max(0, date - startDate);
  return Math.floor(diff / (7 * DAY_MS)) + 1;
}

function defaultState(): State {
  return {
    version: 1,
    startDate: Date.now(),
    selectedDay: 1,
    rampUp: true,
    drafts: {},
    history: [],
  };
}

function loadState(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as State;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function parseNum(s: string): number | null {
  const n = parseFloat(s);
  if (isNaN(n) || n < 0) return null;
  return n;
}

function isLoggedSet(s: SetLog): boolean {
  const w = parseNum(s.weight);
  const r = parseNum(s.reps);
  return w != null && r != null && r > 0;
}

function topWeightOf(sets: SetLog[] | undefined): number | null {
  if (!sets) return null;
  let top: number | null = null;
  for (const s of sets) {
    if (!isLoggedSet(s)) continue;
    const w = parseFloat(s.weight);
    if (top == null || w > top) top = w;
  }
  return top;
}

function lastTopFor(
  history: Session[],
  day: number,
  exercise: string,
): { weight: number; when: number } | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const s = history[i];
    if (s.day !== day) continue;
    const t = topWeightOf(s.entries[exercise]);
    if (t != null) return { weight: t, when: s.date };
  }
  return null;
}

function roundTo(v: number, step: number) {
  return Math.round(v / step) * step;
}

function rampPct(week: number, rampUp: boolean): number | null {
  if (!rampUp) return null;
  if (week === 1) return 0.6;
  if (week === 2) return 0.75;
  return null;
}

function fmtDelta(delta: number): Hint {
  if (Math.abs(delta) < 0.01) return { text: "same as last", tone: "flat" };
  const sign = delta > 0 ? "+" : "−";
  const abs = Math.abs(delta);
  const fixed = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(1);
  return { text: `${sign}${fixed}kg`, tone: delta > 0 ? "up" : "down" };
}

function downloadHistory(history: Session[]) {
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `beastmode-history-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fmtDate(ms: number) {
  return new Date(ms)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
}

export default function Page() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    setState(loadState() ?? defaultState());
  }, []);

  useEffect(() => {
    if (!state) return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // quota exceeded or storage blocked — user still has in-memory state
      }
    }, WRITE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  if (!state) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black">
        <div className="font-display text-2xl tracking-widest text-beast-accent">
          BEASTMODE
        </div>
      </main>
    );
  }

  const currentWeek = weekOf(Date.now(), state.startDate);
  const workout = findWorkout(state.selectedDay);
  const actualDraft = state.drafts[state.selectedDay];
  const hasDraft = actualDraft != null;
  const entriesForDay = actualDraft?.entries ?? blankEntries(state.selectedDay);
  const ramp = rampPct(currentWeek, state.rampUp);

  const ensureDraft = (prev: State): State => {
    if (prev.drafts[prev.selectedDay]) return prev;
    return {
      ...prev,
      drafts: {
        ...prev.drafts,
        [prev.selectedDay]: emptySession(prev.selectedDay, prev.startDate),
      },
    };
  };

  const setField = (
    exercise: string,
    idx: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    setState((prev) => {
      if (!prev) return prev;
      const base = ensureDraft(prev);
      const d = base.drafts[base.selectedDay];
      const sets = d.entries[exercise].slice();
      sets[idx] = { ...sets[idx], [field]: value };
      const nextDraft: Session = {
        ...d,
        entries: { ...d.entries, [exercise]: sets },
      };
      return {
        ...base,
        drafts: { ...base.drafts, [base.selectedDay]: nextDraft },
      };
    });
  };

  const selectDay = (day: number) => {
    setState((prev) => (prev ? { ...prev, selectedDay: day } : prev));
  };

  const toggleRamp = () => {
    setState((prev) => (prev ? { ...prev, rampUp: !prev.rampUp } : prev));
  };

  const saveSession = () => {
    setState((prev) => {
      if (!prev) return prev;
      const d = prev.drafts[prev.selectedDay];
      if (!d) return prev;
      const entries: Record<string, SetLog[]> = {};
      let hasAny = false;
      for (const [name, sets] of Object.entries(d.entries)) {
        const kept = sets.filter(isLoggedSet);
        if (kept.length > 0) {
          entries[name] = kept;
          hasAny = true;
        }
      }
      if (!hasAny) return prev;
      const finalized: Session = {
        ...d,
        id: `s-${Date.now()}`,
        date: Date.now(),
        week: weekOf(Date.now(), prev.startDate),
        entries,
      };
      const nextDrafts = { ...prev.drafts };
      delete nextDrafts[prev.selectedDay];
      return {
        ...prev,
        history: [...prev.history, finalized],
        drafts: nextDrafts,
      };
    });
  };

  const clearDraft = () => {
    setState((prev) => {
      if (!prev) return prev;
      const nextDrafts = { ...prev.drafts };
      delete nextDrafts[prev.selectedDay];
      return { ...prev, drafts: nextDrafts };
    });
  };

  const todayStr = fmtDate(Date.now());

  return (
    <>
      <main className="mx-auto max-w-xl pb-40">
        <header className="sticky top-0 z-30 border-b-2 border-beast-accent bg-black">
          <div className="flex items-start justify-between px-4 py-3">
            <div>
              <h1 className="font-display text-3xl leading-none tracking-tight text-beast-ink">
                BEAST<span className="text-beast-accent">MODE</span>
              </h1>
              <div className="mt-1 flex gap-2 font-mono text-[11px] text-beast-mute">
                <span>WK {String(currentWeek).padStart(2, "0")}</span>
                <span>•</span>
                <span>{todayStr}</span>
                <span>•</span>
                <span>{state.history.length} LOGGED</span>
              </div>
            </div>
            <button
              onClick={toggleRamp}
              className={`h-12 border-2 px-3 font-display text-xs tracking-widest ${
                state.rampUp
                  ? "border-beast-accent bg-beast-accent text-black"
                  : "border-beast-line bg-black text-beast-ink"
              }`}
            >
              RAMP {state.rampUp ? "ON" : "OFF"}
            </button>
          </div>
        </header>

        <section className="border-b-2 border-beast-line px-4 py-3">
          <div className="grid grid-cols-5 gap-2">
            {WORKOUTS.map((w) => {
              const active = state.selectedDay === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => selectDay(w.id)}
                  className={`flex h-14 flex-col items-center justify-center border-2 font-display ${
                    active
                      ? "border-beast-accent bg-beast-accent text-black"
                      : "border-beast-line bg-black text-beast-ink active:bg-beast-panel"
                  }`}
                >
                  <span className="text-lg leading-none">{w.code}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 font-display text-2xl tracking-tight">
            {workout.name}
          </div>
          <div className="font-mono text-[11px] text-beast-mute">
            {workout.exercises.length} EXERCISES • ~60 MIN
          </div>
        </section>

        {ramp != null && (
          <section className="border-b-2 border-beast-accent bg-beast-panel px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="hatch h-8 w-2" />
              <div className="flex-1">
                <div className="font-display text-sm tracking-widest text-beast-accent">
                  RAMP-UP W{currentWeek}
                </div>
                <div className="font-mono text-xs text-beast-ink">
                  LIFT AT {Math.round(ramp * 100)}% — REBUILD, DON&apos;T BREAK
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="divide-y-2 divide-beast-line border-b-2 border-beast-line">
          {workout.exercises.map((ex) => {
            const sets = entriesForDay[ex.name] ?? [];
            const last = lastTopFor(state.history, workout.id, ex.name);
            const currentTop = topWeightOf(sets);
            let hint: Hint;
            if (last && currentTop != null) {
              hint = fmtDelta(currentTop - last.weight);
            } else if (last) {
              hint = { text: `last: ${last.weight}kg`, tone: "info" };
            } else {
              hint = { text: "no history", tone: "none" };
            }
            const suggested =
              ramp != null && last ? roundTo(last.weight * ramp, 2.5) : null;

            return (
              <article key={ex.name} className="bg-black px-4 py-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg leading-tight tracking-tight text-beast-ink">
                    {ex.name.toUpperCase()}
                  </h2>
                  <div className="shrink-0 font-mono text-xs text-beast-mute">
                    {ex.sets}×{ex.reps}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
                  <span className={HINT_COLOR[hint.tone]}>
                    {hint.text.toUpperCase()}
                  </span>
                  {suggested != null && (
                    <span className="text-beast-accent">TRY {suggested}KG</span>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {sets.map((s, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[32px_1fr_1fr] items-stretch gap-2"
                    >
                      <div className="flex items-center justify-center border-2 border-beast-line font-display text-xs text-beast-mute">
                        {i + 1}
                      </div>
                      <SetInput
                        kind="weight"
                        value={s.weight}
                        onChange={(v) => setField(ex.name, i, "weight", v)}
                      />
                      <SetInput
                        kind="reps"
                        value={s.reps}
                        onChange={(v) => setField(ex.name, i, "reps", v)}
                      />
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <section className="px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={saveSession}
              disabled={!hasDraft}
              className="h-14 border-2 border-beast-accent bg-beast-accent font-display text-lg text-black disabled:cursor-not-allowed disabled:border-beast-line disabled:bg-black disabled:text-beast-mute active:translate-y-[1px]"
            >
              SAVE SESSION
            </button>
            <button
              onClick={clearDraft}
              disabled={!hasDraft}
              className="h-14 border-2 border-beast-line bg-black font-display text-lg text-beast-ink disabled:cursor-not-allowed disabled:text-beast-mute active:translate-y-[1px]"
            >
              RESET
            </button>
          </div>
          <button
            onClick={() => downloadHistory(state.history)}
            disabled={state.history.length === 0}
            className="mt-2 h-12 w-full border-2 border-beast-line bg-black font-display text-sm text-beast-ink disabled:cursor-not-allowed disabled:text-beast-mute active:translate-y-[1px]"
          >
            EXPORT HISTORY ({state.history.length})
          </button>
        </section>

        <HistorySummary history={state.history} />
      </main>

      <RestTimer />
    </>
  );
}

function SetInput({
  kind,
  value,
  onChange,
}: {
  kind: "weight" | "reps";
  value: string;
  onChange: (v: string) => void;
}) {
  const isWeight = kind === "weight";
  return (
    <label className="relative flex">
      <input
        type="number"
        inputMode={isWeight ? "decimal" : "numeric"}
        step={isWeight ? "0.5" : "1"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="h-12 w-full border-2 border-beast-line bg-black px-3 pr-10 font-mono text-lg text-beast-ink outline-none focus:border-beast-accent"
      />
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-beast-mute">
        {isWeight ? "KG" : "REPS"}
      </span>
    </label>
  );
}

function HistorySummary({ history }: { history: Session[] }) {
  const byWeek = useMemo(() => {
    const map = new Map<number, Session[]>();
    for (const s of history) {
      const arr = map.get(s.week) ?? [];
      arr.push(s);
      map.set(s.week, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => b.date - a.date);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [history]);

  if (history.length === 0) {
    return (
      <section className="mx-4 mb-6 border-2 border-dashed border-beast-line px-4 py-6 text-center">
        <div className="font-display text-sm tracking-widest text-beast-mute">
          NO SESSIONS YET
        </div>
        <div className="mt-1 font-mono text-[11px] text-beast-mute">
          LOG A SET AND HIT SAVE
        </div>
      </section>
    );
  }

  return (
    <section className="mx-4 mb-6 border-2 border-beast-line">
      <div className="border-b-2 border-beast-line bg-beast-panel px-3 py-2 font-display text-xs tracking-widest text-beast-mute">
        HISTORY
      </div>
      <ul className="divide-y-2 divide-beast-line">
        {byWeek.map(([wk, sessions]) => (
          <li key={wk} className="px-3 py-2">
            <div className="font-display text-sm text-beast-accent">
              WEEK {String(wk).padStart(2, "0")}
            </div>
            <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-beast-ink">
              {sessions.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>
                    {s.dayCode} {s.dayName}
                  </span>
                  <span className="text-beast-mute">{fmtDate(s.date)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
