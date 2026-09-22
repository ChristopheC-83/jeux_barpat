export const MAX_ATTEMPTS = 6;

export type LetterState = "correct" | "present" | "absent";
export type KeyboardState = LetterState | "unused";
export type GameStatus = "playing" | "won" | "lost";

export type EvaluatedLetter = {
  letter: string;
  state: LetterState;
};

export type EvaluatedGuess = {
  word: string;
  letters: readonly EvaluatedLetter[];
};

export type GuessValidation =
  | { valid: true; word: string }
  | { valid: false; reason: "incomplete" | "unknown" };

const KEYBOARD_STATE_PRIORITY: Record<KeyboardState, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function normalizeWord(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function validateGuess(
  guess: string,
  acceptedWords: ReadonlySet<string>,
  wordLength: number,
): GuessValidation {
  const word = normalizeWord(guess);

  if (word.length !== wordLength) {
    return { valid: false, reason: "incomplete" };
  }

  if (!/^[A-Z]+$/.test(word) || !acceptedWords.has(word)) {
    return { valid: false, reason: "unknown" };
  }

  return { valid: true, word };
}

export function evaluateGuess(guess: string, solution: string): EvaluatedGuess {
  const normalizedGuess = normalizeWord(guess);
  const normalizedSolution = normalizeWord(solution);
  const wordLength = normalizedSolution.length;

  if (
    wordLength === 0 ||
    normalizedGuess.length !== wordLength ||
    !/^[A-Z]+$/.test(normalizedGuess) ||
    !/^[A-Z]+$/.test(normalizedSolution)
  ) {
    throw new Error(
      "La proposition et la solution doivent contenir le même nombre de lettres A à Z.",
    );
  }

  const states: LetterState[] = Array.from(
    { length: wordLength },
    () => "absent" as const,
  );
  const remainingOccurrences = new Map<string, number>();

  for (let index = 0; index < wordLength; index += 1) {
    if (normalizedGuess[index] === normalizedSolution[index]) {
      states[index] = "correct";
    } else {
      const letter = normalizedSolution[index];
      remainingOccurrences.set(
        letter,
        (remainingOccurrences.get(letter) ?? 0) + 1,
      );
    }
  }

  for (let index = 0; index < wordLength; index += 1) {
    if (states[index] === "correct") {
      continue;
    }

    const letter = normalizedGuess[index];
    const remaining = remainingOccurrences.get(letter) ?? 0;

    if (remaining > 0) {
      states[index] = "present";
      remainingOccurrences.set(letter, remaining - 1);
    }
  }

  return {
    word: normalizedGuess,
    letters: normalizedGuess.split("").map((letter, index) => ({
      letter,
      state: states[index],
    })),
  };
}

export function deriveGameStatus(
  guesses: readonly string[],
  solution: string,
): GameStatus {
  const normalizedSolution = normalizeWord(solution);

  if (guesses.some((guess) => normalizeWord(guess) === normalizedSolution)) {
    return "won";
  }

  return guesses.length >= MAX_ATTEMPTS ? "lost" : "playing";
}

export function mergeKeyboardStates(
  currentStates: Readonly<Partial<Record<string, KeyboardState>>>,
  evaluatedGuess: EvaluatedGuess,
): Partial<Record<string, KeyboardState>> {
  const nextStates = { ...currentStates };

  for (const { letter, state } of evaluatedGuess.letters) {
    const currentState = nextStates[letter] ?? "unused";

    if (KEYBOARD_STATE_PRIORITY[state] > KEYBOARD_STATE_PRIORITY[currentState]) {
      nextStates[letter] = state;
    }
  }

  return nextStates;
}

export function buildKeyboardStates(
  guesses: readonly EvaluatedGuess[],
): Partial<Record<string, KeyboardState>> {
  return guesses.reduce<Partial<Record<string, KeyboardState>>>(
    (states, guess) => mergeKeyboardStates(states, guess),
    {},
  );
}
