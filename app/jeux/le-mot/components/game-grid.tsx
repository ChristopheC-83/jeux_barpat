import type { CSSProperties } from "react";

import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  type EvaluatedGuess,
  type GameStatus,
  type LetterState,
} from "@/app/jeux/le-mot/lib/game";
import styles from "@/app/jeux/le-mot/le-mot.module.css";

type GameGridProps = {
  guesses: readonly EvaluatedGuess[];
  currentGuess: string;
  status: GameStatus;
  shakeKey: number;
};

const STATE_LABELS: Record<LetterState, string> = {
  correct: "bien placée",
  present: "présente ailleurs",
  absent: "absente",
};

const STATE_MARKERS: Record<LetterState, string> = {
  correct: "✓",
  present: "•",
  absent: "×",
};

const STATE_CLASSES: Record<LetterState, string> = {
  correct: "border-emerald-800 bg-emerald-700 text-white",
  present: "border-amber-700 bg-amber-400 text-zinc-950",
  absent: "border-zinc-700 bg-zinc-600 text-white",
};

export function GameGrid({
  guesses,
  currentGuess,
  status,
  shakeKey,
}: GameGridProps) {
  return (
    <div
      role="grid"
      aria-label="Grille de six essais de cinq lettres"
      className="grid w-full max-w-[21rem] gap-1.5 sm:gap-2"
    >
      {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
        const evaluatedGuess = guesses[rowIndex];
        const isCurrentRow =
          !evaluatedGuess && rowIndex === guesses.length && status === "playing";
        const letters = evaluatedGuess?.letters ??
          Array.from({ length: WORD_LENGTH }, (_, letterIndex) => ({
            letter: isCurrentRow ? (currentGuess[letterIndex] ?? "") : "",
            state: undefined,
          }));

        return (
          <div
            role="row"
            key={isCurrentRow ? `current-${rowIndex}-${shakeKey}` : rowIndex}
            className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${isCurrentRow && shakeKey > 0 ? styles.shake : ""}`}
          >
            {letters.map(({ letter, state }, letterIndex) => {
              const stateLabel = state ? STATE_LABELS[state] : null;
              const label = letter
                ? `Ligne ${rowIndex + 1}, colonne ${letterIndex + 1} : ${letter}${stateLabel ? `, ${stateLabel}` : ""}`
                : `Ligne ${rowIndex + 1}, colonne ${letterIndex + 1} : vide`;
              const animationStyle = evaluatedGuess
                ? ({ animationDelay: `${letterIndex * 70}ms` } as CSSProperties)
                : undefined;

              return (
                <div
                  role="gridcell"
                  aria-label={label}
                  key={letterIndex}
                  style={animationStyle}
                  className={`relative flex aspect-square items-center justify-center rounded-md border-2 text-2xl font-bold sm:text-3xl ${
                    state
                      ? `${STATE_CLASSES[state]} ${styles.reveal}`
                      : letter
                        ? `border-[var(--foreground)] bg-[var(--card)] text-[var(--card-foreground)] ${styles.pop}`
                        : "border-[var(--border)] bg-[var(--card)]"
                  }`}
                >
                  <span aria-hidden="true">{letter}</span>
                  {state && (
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-0.5 text-xs leading-none"
                    >
                      {STATE_MARKERS[state]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
