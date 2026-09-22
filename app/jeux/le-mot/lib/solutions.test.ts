import { describe, expect, it } from "vitest";

import type { DictionaryWord } from "@/app/data/words";

import { findSolution, pickSolution } from "./solutions";

const WORDS: readonly DictionaryWord[] = [
  {
    id: "5-0",
    word: "ÉCRAN",
    search: "ECRAN",
    frequency: 2,
    canBeSolution: true,
  },
  {
    id: "5-1",
    word: "PORNO",
    search: "PORNO",
    frequency: 1,
    canBeSolution: false,
  },
  {
    id: "5-2",
    word: "POMME",
    search: "POMME",
    frequency: 1,
    canBeSolution: true,
  },
];

describe("sélection d’une solution", () => {
  it("sélectionne une entrée autorisée", () => {
    expect(pickSolution(WORDS, undefined, () => 0).id).toBe("5-0");
  });

  it("ne sélectionne jamais une entrée interdite", () => {
    expect(pickSolution(WORDS, undefined, () => 0.5).canBeSolution).toBe(true);
    expect(pickSolution(WORDS, undefined, () => 0.5).search).not.toBe("PORNO");
  });

  it("évite de reprendre immédiatement la même solution autorisée", () => {
    expect(pickSolution(WORDS, "5-0", () => 0).id).toBe("5-2");
  });

  it("ne restaure pas une entrée interdite comme solution", () => {
    expect(findSolution(WORDS, "5-1")).toBeUndefined();
  });

  it("échoue clairement quand aucune solution n’est autorisée", () => {
    const forbiddenWords = WORDS.filter((word) => !word.canBeSolution);

    expect(() => pickSolution(forbiddenWords, undefined, () => 0)).toThrow(
      /aucun mot autorisé comme solution/,
    );
  });
});
