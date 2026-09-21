const KEY_ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["W", "X", "C", "V", "B", "N"],
] as const;

export type KeyboardKeyState = "correct" | "present" | "absent" | "unused";

type KeyboardProps = {
  letterStates: Readonly<Partial<Record<string, KeyboardKeyState>>>;
  onLetter: (letter: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
};

const STATE_LABELS: Record<Exclude<KeyboardKeyState, "unused">, string> = {
  correct: "bien placée",
  present: "présente ailleurs",
  absent: "absente",
};

const STATE_MARKERS: Record<Exclude<KeyboardKeyState, "unused">, string> = {
  correct: "✓",
  present: "•",
  absent: "×",
};

const STATE_CLASSES: Record<KeyboardKeyState, string> = {
  unused:
    "border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]",
  correct: "border-emerald-800 bg-emerald-700 text-white",
  present: "border-amber-700 bg-amber-400 text-zinc-950",
  absent: "border-zinc-700 bg-zinc-600 text-white",
};

export function Keyboard({
  letterStates,
  onLetter,
  onDelete,
  onSubmit,
  disabled = false,
}: KeyboardProps) {
  return (
    <div
      role="group"
      className="flex w-full max-w-2xl flex-col gap-1.5"
      aria-label="Clavier AZERTY"
    >
      {KEY_ROWS.map((row) => (
        <div key={row.join("")} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((letter) => {
            const state = letterStates[letter] ?? "unused";
            const stateLabel = state === "unused" ? null : STATE_LABELS[state];

            return (
              <button
                key={letter}
                type="button"
                disabled={disabled}
                onClick={() => onLetter(letter)}
                aria-label={stateLabel ? `${letter}, ${stateLabel}` : letter}
                className={`relative flex h-12 min-w-0 max-w-12 flex-1 items-center justify-center rounded-md border text-sm font-bold shadow-sm transition-[background-color,border-color,transform] active:scale-95 disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transform-none motion-reduce:transition-none sm:h-13 sm:text-base ${STATE_CLASSES[state]} focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]`}
              >
                {letter}
                {state !== "unused" && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-0 text-[0.6rem] leading-none"
                  >
                    {STATE_MARKERS[state]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-1 flex justify-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          className="min-h-12 flex-1 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 font-semibold text-[var(--foreground)] shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          Effacer
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="min-h-12 flex-[1.35] rounded-md bg-[var(--primary)] px-4 font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
