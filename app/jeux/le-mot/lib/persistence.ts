import {
  ACCEPTED_WORDS,
  findSolution,
} from "@/app/jeux/le-mot/data/words";
import {
  deriveGameStatus,
  MAX_ATTEMPTS,
  normalizeWord,
  validateGuess,
  type GameStatus,
} from "@/app/jeux/le-mot/lib/game";

export const STORAGE_VERSION = 1 as const;
export const STORAGE_KEY = "barpat-jeux:le-mot:game";

export type PersistedGame = {
  version: typeof STORAGE_VERSION;
  solutionId: string;
  guesses: string[];
  currentGuess: string;
  status: GameStatus;
};

type ReadableStorage = Pick<Storage, "getItem" | "removeItem">;
type WritableStorage = Pick<Storage, "setItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parsePersistedGame(value: unknown): PersistedGame | null {
  if (
    !isRecord(value) ||
    value.version !== STORAGE_VERSION ||
    typeof value.solutionId !== "string" ||
    !Array.isArray(value.guesses) ||
    typeof value.currentGuess !== "string" ||
    !["playing", "won", "lost"].includes(String(value.status))
  ) {
    return null;
  }

  const solution = findSolution(value.solutionId);
  const guesses = value.guesses.map((guess) =>
    typeof guess === "string" ? normalizeWord(guess) : "",
  );
  const currentGuess = normalizeWord(value.currentGuess);

  if (
    !solution ||
    guesses.length > MAX_ATTEMPTS ||
    guesses.some((guess) => !validateGuess(guess, ACCEPTED_WORDS).valid) ||
    currentGuess.length > 5 ||
    !/^[A-Z]*$/.test(currentGuess)
  ) {
    return null;
  }

  const winningGuessIndex = guesses.findIndex(
    (guess) => guess === solution.word,
  );
  if (winningGuessIndex >= 0 && winningGuessIndex !== guesses.length - 1) {
    return null;
  }

  const status = value.status as GameStatus;
  if (
    deriveGameStatus(guesses, solution.word) !== status ||
    (status !== "playing" && currentGuess !== "")
  ) {
    return null;
  }

  return {
    version: STORAGE_VERSION,
    solutionId: solution.id,
    guesses,
    currentGuess,
    status,
  };
}

export function loadGame(
  storage: ReadableStorage = window.localStorage,
): PersistedGame | null {
  const rawValue = storage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const game = parsePersistedGame(JSON.parse(rawValue));
    if (!game) {
      storage.removeItem(STORAGE_KEY);
    }
    return game;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveGame(
  game: PersistedGame,
  storage: WritableStorage = window.localStorage,
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(game));
}

export function clearGame(
  storage: Pick<Storage, "removeItem"> = window.localStorage,
): void {
  storage.removeItem(STORAGE_KEY);
}
