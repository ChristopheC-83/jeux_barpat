type DebugLogger = Pick<Console, "info">;

export function logSolutionInDevelopment(
  solution: string,
  environment: string | undefined = process.env.NODE_ENV,
  logger: DebugLogger = console,
): void {
  if (environment === "development") {
    logger.info(`[Le Mot] Solution : ${solution}`);
  }
}
