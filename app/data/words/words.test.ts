import { describe, expect, it } from "vitest";

import {
  getWordsByLength,
  validateWords,
  type WordLength,
} from "./index";

const SUPPORTED_LENGTHS: readonly WordLength[] = [3, 4, 5, 6, 7];

describe.each(SUPPORTED_LENGTHS)("dictionnaire de %i lettres", (length) => {
  it("charge uniquement des entrées valides et uniques", async () => {
    const words = await getWordsByLength(length);
    const searches = new Set(words.map((word) => word.search));

    expect(words.length).toBeGreaterThan(0);
    expect(searches.size).toBe(words.length);

    for (const word of words) {
      expect(word.word).not.toBe("");
      expect(word.search).toMatch(new RegExp(`^[A-Z]{${length}}$`));
      expect(word.frequency).toBeGreaterThan(0);
      expect(word.canBeSolution).toBeTypeOf("boolean");
    }
  });
});

describe("validateWords", () => {
  it("échoue clairement lorsqu’un search est dupliqué", () => {
    const duplicate = {
      word: "CHAT",
      search: "CHAT",
      frequency: 1,
      canBeSolution: true,
    };

    expect(() => validateWords([duplicate, duplicate], 4)).toThrow(
      /doublon CHAT/,
    );
  });

  it("rejette une entrée sans indicateur de solution", () => {
    expect(() =>
      validateWords([{ word: "CHAT", search: "CHAT", frequency: 1 }], 4),
    ).toThrow(/canBeSolution doit être un booléen/);
  });
});

describe("règles des dictionnaires corrigés", () => {
  it("reconnaît techniquement le dictionnaire de trois lettres", async () => {
    const words = await getWordsByLength(3);

    expect(words.length).toBeGreaterThan(0);
    expect(words.every((word) => word.search.length === 3)).toBe(true);
  });

  it("interdit PORNO comme solution dans le dictionnaire réel", async () => {
    const words = await getWordsByLength(5);
    const entry = words.find((word) => word.search === "PORNO");

    expect(entry).toBeDefined();
    expect(entry?.canBeSolution).toBe(false);
  });
});
