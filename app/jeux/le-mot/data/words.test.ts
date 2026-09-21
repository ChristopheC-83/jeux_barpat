import { describe, expect, it } from "vitest";

import { ACCEPTED_WORDS, pickSolution, SOLUTIONS } from "./words";

describe("dictionnaires provisoires", () => {
  it("contient uniquement des solutions acceptées de cinq lettres", () => {
    for (const solution of SOLUTIONS) {
      expect(solution.word).toMatch(/^[A-Z]{5}$/);
      expect(ACCEPTED_WORDS.has(solution.word)).toBe(true);
    }
  });

  it("évite de reprendre immédiatement la même solution", () => {
    const previousSolution = SOLUTIONS[0];
    const nextSolution = pickSolution(previousSolution.id, () => 0);

    expect(nextSolution.id).not.toBe(previousSolution.id);
  });
});
