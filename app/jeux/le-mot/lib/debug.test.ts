import { describe, expect, it, vi } from "vitest";

import { logSolutionInDevelopment } from "./debug";

describe("logSolutionInDevelopment", () => {
  it("reste silencieux hors développement", () => {
    const logger = { info: vi.fn() };

    logSolutionInDevelopment("POMME", "production", logger);

    expect(logger.info).not.toHaveBeenCalled();
  });

  it("affiche la solution en développement", () => {
    const logger = { info: vi.fn() };

    logSolutionInDevelopment("POMME", "development", logger);

    expect(logger.info).toHaveBeenCalledWith("[Le Mot] Solution : POMME");
  });
});
