import { describe, expect, it } from "vitest";

import {
  deriveGameStatus,
  evaluateGuess,
  mergeKeyboardStates,
  normalizeWord,
  validateGuess,
  type EvaluatedGuess,
} from "./game";

function states(guess: string, solution: string) {
  return evaluateGuess(guess, solution).letters.map((letter) => letter.state);
}

describe("evaluateGuess", () => {
  it("marque un mot entièrement correct", () => {
    expect(states("POMME", "POMME")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("marque les lettres absentes", () => {
    expect(states("LUNDI", "POMME")).toEqual([
      "absent",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("marque les lettres présentes à une autre position", () => {
    expect(states("MELON", "POMME")).toEqual([
      "present",
      "present",
      "absent",
      "present",
      "absent",
    ]);
  });

  it("consomme correctement les occurrences multiples dans APPEL", () => {
    expect(states("PAPAL", "APPEL")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "correct",
    ]);
  });

  it("marque comme absente une occurrence proposée en trop dans POMME", () => {
    expect(states("MAMME", "POMME")).toEqual([
      "absent",
      "absent",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("gère les lettres répétées de ELLES", () => {
    expect(states("SELLE", "ELLES")).toEqual([
      "present",
      "present",
      "correct",
      "present",
      "present",
    ]);
  });
});

describe("normalisation et validation", () => {
  const acceptedWords = new Set(["ECLAT", "POMME"]);

  it("normalise les minuscules et les accents", () => {
    expect(normalizeWord("éclat")).toBe("ECLAT");
  });

  it("refuse un mot incomplet", () => {
    expect(validateGuess("POMM", acceptedWords)).toEqual({
      valid: false,
      reason: "incomplete",
    });
  });

  it("refuse un mot absent du dictionnaire", () => {
    expect(validateGuess("ABCDE", acceptedWords)).toEqual({
      valid: false,
      reason: "unknown",
    });
  });
});

describe("état du clavier", () => {
  it("ne rétrograde jamais une lettre correcte", () => {
    const correctGuess: EvaluatedGuess = {
      word: "AAAAA",
      letters: [{ letter: "A", state: "correct" }],
    };
    const absentGuess: EvaluatedGuess = {
      word: "AAAAA",
      letters: [{ letter: "A", state: "absent" }],
    };

    const correctState = mergeKeyboardStates({}, correctGuess);
    expect(mergeKeyboardStates(correctState, absentGuess).A).toBe("correct");
  });

  it("fait progresser une lettre de absente à présente puis correcte", () => {
    const withState = (state: "absent" | "present" | "correct") => ({
      word: "AAAAA",
      letters: [{ letter: "A", state }],
    });

    const absent = mergeKeyboardStates({}, withState("absent"));
    const present = mergeKeyboardStates(absent, withState("present"));
    const correct = mergeKeyboardStates(present, withState("correct"));

    expect(absent.A).toBe("absent");
    expect(present.A).toBe("present");
    expect(correct.A).toBe("correct");
  });
});

describe("fin de partie", () => {
  it("déclare une victoire lorsque la solution est trouvée", () => {
    expect(deriveGameStatus(["BRUIT", "POMME"], "POMME")).toBe("won");
  });

  it("déclare une défaite après le sixième échec", () => {
    expect(
      deriveGameStatus(
        ["BRUIT", "TABLE", "CHIEN", "FLEUR", "ROBOT", "PLAGE"],
        "POMME",
      ),
    ).toBe("lost");
  });
});
