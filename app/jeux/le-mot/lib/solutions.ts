import type { DictionaryWord } from "@/app/data/words";

export function findSolution(
  words: readonly DictionaryWord[],
  solutionId: string,
): DictionaryWord | undefined {
  return words.find(
    (word) => word.id === solutionId && word.canBeSolution,
  );
}

export function pickSolution(
  words: readonly DictionaryWord[],
  previousSolutionId?: string,
  random: () => number = Math.random,
): DictionaryWord {
  const allowedSolutions = words.filter((word) => word.canBeSolution);

  if (allowedSolutions.length === 0) {
    throw new Error(
      "Le dictionnaire ne contient aucun mot autorisé comme solution.",
    );
  }

  const candidates =
    allowedSolutions.length > 1
      ? allowedSolutions.filter((word) => word.id !== previousSolutionId)
      : allowedSolutions;

  const randomValue = Math.max(0, Math.min(random(), 0.999999999));
  return candidates[Math.floor(randomValue * candidates.length)];
}
