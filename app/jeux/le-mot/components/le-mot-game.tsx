"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GameGrid } from "@/app/jeux/le-mot/components/game-grid";
import {
  ACCEPTED_WORDS,
  findSolution,
  pickSolution,
  type Solution,
} from "@/app/jeux/le-mot/data/words";
import { logSolutionInDevelopment } from "@/app/jeux/le-mot/lib/debug";
import {
  buildKeyboardStates,
  deriveGameStatus,
  evaluateGuess,
  normalizeWord,
  validateGuess,
} from "@/app/jeux/le-mot/lib/game";
import {
  clearGame,
  loadGame,
  saveGame,
  STORAGE_VERSION,
  type PersistedGame,
} from "@/app/jeux/le-mot/lib/persistence";
import { Keyboard } from "@/components/keyboard";

type Feedback = {
  key: number;
  kind: "idle" | "error" | "result";
  message: string;
};

const EMPTY_FEEDBACK: Feedback = { key: 0, kind: "idle", message: "" };

function createGame(solution: Solution): PersistedGame {
  return {
    version: STORAGE_VERSION,
    solutionId: solution.id,
    guesses: [],
    currentGuess: "",
    status: "playing",
  };
}

function resultMessage(game: PersistedGame, solution: Solution): string {
  return game.status === "won"
    ? `Bravo ! Vous avez trouvé ${solution.word}.`
    : `Partie terminée. La solution était ${solution.word}.`;
}

export function LeMotGame() {
  const [game, setGame] = useState<PersistedGame | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(EMPTY_FEEDBACK);

  const solution = game ? findSolution(game.solutionId) : undefined;
  const evaluatedGuesses = useMemo(
    () =>
      game && solution
        ? game.guesses.map((guess) => evaluateGuess(guess, solution.word))
        : [],
    [game, solution],
  );
  const keyboardStates = useMemo(
    () => buildKeyboardStates(evaluatedGuesses),
    [evaluatedGuesses],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedGame = loadGame();
      const initialGame = savedGame ?? createGame(pickSolution());
      const initialSolution = findSolution(initialGame.solutionId);

      setGame(initialGame);
      if (initialSolution) {
        logSolutionInDevelopment(initialSolution.word);
        if (initialGame.status !== "playing") {
          setFeedback({
            key: 1,
            kind: "result",
            message: resultMessage(initialGame, initialSolution),
          });
        }
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (game) {
      saveGame(game);
    }
  }, [game]);

  const clearFeedback = useCallback(() => {
    setFeedback((current) =>
      current.message ? { ...current, kind: "idle", message: "" } : current,
    );
  }, []);

  const handleLetter = useCallback(
    (letter: string) => {
      const normalizedLetter = normalizeWord(letter);
      if (!/^[A-Z]$/.test(normalizedLetter)) {
        return;
      }

      clearFeedback();
      setGame((current) => {
        if (
          !current ||
          current.status !== "playing" ||
          current.currentGuess.length >= 5
        ) {
          return current;
        }

        return {
          ...current,
          currentGuess: current.currentGuess + normalizedLetter,
        };
      });
    },
    [clearFeedback],
  );

  const handleDelete = useCallback(() => {
    clearFeedback();
    setGame((current) => {
      if (!current || current.status !== "playing") {
        return current;
      }

      return {
        ...current,
        currentGuess: current.currentGuess.slice(0, -1),
      };
    });
  }, [clearFeedback]);

  const handleSubmit = useCallback(() => {
    if (!game || !solution || game.status !== "playing") {
      return;
    }

    const validation = validateGuess(game.currentGuess, ACCEPTED_WORDS);
    if (!validation.valid) {
      const message =
        validation.reason === "incomplete"
          ? "Le mot doit contenir cinq lettres."
          : "Ce mot n’est pas dans le dictionnaire.";
      setFeedback((current) => ({
        key: current.key + 1,
        kind: "error",
        message,
      }));
      return;
    }

    const guesses = [...game.guesses, validation.word];
    const status = deriveGameStatus(guesses, solution.word);
    const nextGame: PersistedGame = {
      ...game,
      guesses,
      currentGuess: "",
      status,
    };

    setGame(nextGame);
    setFeedback((current) => ({
      key: current.key + 1,
      kind: status === "playing" ? "idle" : "result",
      message:
        status === "playing"
          ? `${6 - guesses.length} essai${guesses.length === 5 ? "" : "s"} restant${guesses.length === 5 ? "" : "s"}.`
          : resultMessage(nextGame, solution),
    }));
  }, [game, solution]);

  const handleNewGame = useCallback(() => {
    const nextSolution = pickSolution(game?.solutionId);
    clearGame();
    setGame(createGame(nextSolution));
    setFeedback(EMPTY_FEEDBACK);
    logSolutionInDevelopment(nextSolution.word);
  }, [game?.solutionId]);

  useEffect(() => {
    if (!game || game.status !== "playing") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        handleLetter(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handleDelete();
      } else if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, handleDelete, handleLetter, handleSubmit]);

  const displayedStatus = game?.status ?? "playing";

  return (
    <section className="flex w-full max-w-2xl flex-col items-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Le Mot</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)] sm:text-base">
          Trouvez le mot en 6 essais
        </p>
      </div>

      <div className="mt-6 flex w-full justify-center sm:mt-8">
        <GameGrid
          guesses={evaluatedGuesses}
          currentGuess={game?.currentGuess ?? ""}
          status={displayedStatus}
          shakeKey={feedback.kind === "error" ? feedback.key : 0}
        />
      </div>

      <div className="mt-4 flex min-h-20 w-full flex-col items-center justify-center text-center">
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`text-sm font-medium ${feedback.kind === "error" ? "text-[var(--destructive)]" : "text-[var(--foreground)]"}`}
        >
          <span key={feedback.key}>{feedback.message}</span>
        </div>
        {game && solution && game.status !== "playing" && (
          <div className="mt-2 flex flex-col items-center gap-3">
            <p>
              Solution : <strong className="tracking-widest">{solution.word}</strong>
            </p>
            <button
              type="button"
              onClick={handleNewGame}
              className="rounded-md bg-[var(--primary)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)] shadow-sm transition-transform active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]"
            >
              Nouvelle partie
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 w-full sm:mt-7">
        <Keyboard
          letterStates={keyboardStates}
          onLetter={handleLetter}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          disabled={!game || game.status !== "playing"}
        />
      </div>
    </section>
  );
}
