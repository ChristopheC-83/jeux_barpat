import { describe, expect, it } from "vitest";

import { parsePersistedGame, STORAGE_VERSION } from "./persistence";

describe("parsePersistedGame", () => {
  it("restaure une partie valide", () => {
    expect(
      parsePersistedGame({
        version: STORAGE_VERSION,
        solutionId: "pomme",
        guesses: ["BRUIT"],
        currentGuess: "PO",
        status: "playing",
      }),
    ).toEqual({
      version: STORAGE_VERSION,
      solutionId: "pomme",
      guesses: ["BRUIT"],
      currentGuess: "PO",
      status: "playing",
    });
  });

  it("rejette une version incompatible", () => {
    expect(
      parsePersistedGame({
        version: 2,
        solutionId: "pomme",
        guesses: [],
        currentGuess: "",
        status: "playing",
      }),
    ).toBeNull();
  });

  it("rejette un statut incohérent avec les propositions", () => {
    expect(
      parsePersistedGame({
        version: STORAGE_VERSION,
        solutionId: "pomme",
        guesses: ["POMME"],
        currentGuess: "",
        status: "playing",
      }),
    ).toBeNull();
  });
});
