export type Solution = {
  id: string;
  word: string;
};

export const SOLUTIONS: readonly Solution[] = [
  { id: "appel", word: "APPEL" },
  { id: "arbre", word: "ARBRE" },
  { id: "avion", word: "AVION" },
  { id: "chien", word: "CHIEN" },
  { id: "eclat", word: "ECLAT" },
  { id: "etage", word: "ETAGE" },
  { id: "fleur", word: "FLEUR" },
  { id: "foret", word: "FORET" },
  { id: "livre", word: "LIVRE" },
  { id: "monde", word: "MONDE" },
  { id: "nuage", word: "NUAGE" },
  { id: "ocean", word: "OCEAN" },
  { id: "plage", word: "PLAGE" },
  { id: "pomme", word: "POMME" },
  { id: "porte", word: "PORTE" },
  { id: "robot", word: "ROBOT" },
  { id: "table", word: "TABLE" },
  { id: "terre", word: "TERRE" },
  { id: "tigre", word: "TIGRE" },
  { id: "verre", word: "VERRE" },
] as const;

const EXTRA_ACCEPTED_WORDS = [
  "AIMER",
  "ALLER",
  "AMOUR",
  "ANGLE",
  "BANDE",
  "BARBE",
  "BOIRE",
  "BRUIT",
  "CARTE",
  "CHAOS",
  "CHOSE",
  "CORDE",
  "COURS",
  "CRANE",
  "DANSE",
  "DOUCE",
  "DROIT",
  "ECRAN",
  "FAIRE",
  "FEMME",
  "FRUIT",
  "GRAND",
  "HERBE",
  "IMAGE",
  "JAUNE",
  "JOUER",
  "LAMPE",
  "LIGNE",
  "LOURD",
  "MAMIE",
  "MERCI",
  "METRE",
  "MIEUX",
  "MOMIE",
  "NOIRE",
  "OMBRE",
  "ORAGE",
  "PERLE",
  "PETIT",
  "PIANO",
  "PIECE",
  "PLEIN",
  "POCHE",
  "REINE",
  "REPAS",
  "RONDE",
  "ROUGE",
  "ROUTE",
  "SABLE",
  "SALLE",
  "SAUCE",
  "SPORT",
  "SUCRE",
  "TERME",
  "TETES",
  "TEXTE",
  "VENIR",
  "VERTS",
  "VITRE",
  "ZEBRE",
] as const;

export const ACCEPTED_WORDS: ReadonlySet<string> = new Set([
  ...SOLUTIONS.map((solution) => solution.word),
  ...EXTRA_ACCEPTED_WORDS,
]);

export function findSolution(solutionId: string): Solution | undefined {
  return SOLUTIONS.find((solution) => solution.id === solutionId);
}

export function pickSolution(
  previousSolutionId?: string,
  random: () => number = Math.random,
): Solution {
  const candidates =
    SOLUTIONS.length > 1
      ? SOLUTIONS.filter((solution) => solution.id !== previousSolutionId)
      : SOLUTIONS;
  const index = Math.min(
    candidates.length - 1,
    Math.floor(random() * candidates.length),
  );

  return candidates[index];
}
