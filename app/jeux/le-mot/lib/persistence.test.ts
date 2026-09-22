import { describe, expect, it } from "vitest";

import type { DictionaryWord } from "@/app/data/words";

import {
  parsePersistedGame,
  saveGame,
  STORAGE_VERSION,
  type PersistedGame,
} from "./persistence";

const WORDS: readonly DictionaryWord[] = [
  {
    id: "5-0",
    word: "POMME",
    search: "POMME",
    frequency: 10,
    canBeSolution: true,
  },
  {
    id: "5-1",
    word: "BRUIT",
    search: "BRUIT",
    frequency: 5,
    canBeSolution: true,
  },
];

const VALID_GAME: PersistedGame = {
  version: STORAGE_VERSION,
  wordLength: 5,
  solutionId: "5-0",
  guesses: ["BRUIT"],
  currentGuess: "PO",
  status: "playing",
};

describe("parsePersistedGame", () => {
  it("restaure une partie valide", () => {
    expect(parsePersistedGame(VALID_GAME, WORDS, 5)).toEqual(VALID_GAME);
  });

  it("rejette une version incompatible", () => {
    expect(
      parsePersistedGame({ ...VALID_GAME, version: 1 }, WORDS, 5),
    ).toBeNull();
  });

  it("rejette une longueur incompatible", () => {
    expect(
      parsePersistedGame({ ...VALID_GAME, wordLength: 4 }, WORDS, 5),
    ).toBeNull();
  });

  it("rejette un statut incohérent avec les propositions", () => {
    expect(
      parsePersistedGame(
        {
          ...VALID_GAME,
          guesses: ["POMME"],
          currentGuess: "",
          status: "playing",
        },
        WORDS,
        5,
      ),
    ).toBeNull();
  });

  it("ne sauvegarde pas le mot solution comme donnée dédiée", () => {
    let savedValue = "";

    saveGame(VALID_GAME, {
      setItem: (_key, value) => {
        savedValue = value;
      },
    });

    expect(savedValue).not.toContain('"solution"');
    expect(savedValue).not.toContain("POMME");
    expect(JSON.parse(savedValue).solutionId).toBe("5-0");
  });
});
