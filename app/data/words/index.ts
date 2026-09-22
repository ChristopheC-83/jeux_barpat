export type WordLength = 3 | 4 | 5 | 6 | 7;

export type WordEntry = {
  word: string;
  search: string;
  frequency: number;
  canBeSolution: boolean;
};

export type DictionaryWord = WordEntry & {
  id: string;
};

type DictionaryLoader = () => Promise<unknown>;

const DICTIONARY_LOADERS: Record<WordLength, DictionaryLoader> = {
  3: async () => (await import("./words-3.json")).default,
  4: async () => (await import("./words-4.json")).default,
  5: async () => (await import("./words-5.json")).default,
  6: async () => (await import("./words-6.json")).default,
  7: async () => (await import("./words-7.json")).default,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function entryError(length: WordLength, index: number, reason: string): Error {
  return new Error(
    `Dictionnaire des mots de ${length} lettres, entrée ${index + 1} : ${reason}`,
  );
}

export function validateWords(
  value: unknown,
  length: WordLength,
): readonly DictionaryWord[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `Le dictionnaire des mots de ${length} lettres doit être une liste non vide.`,
    );
  }

  const searches = new Set<string>();

  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw entryError(length, index, "l’entrée doit être un objet.");
    }

    const { word, search, frequency, canBeSolution } = entry;

    if (typeof word !== "string" || word.length === 0) {
      throw entryError(length, index, "word doit être une chaîne non vide.");
    }

    if (typeof search !== "string" || !/^[A-Z]+$/.test(search)) {
      throw entryError(length, index, "search doit contenir uniquement A à Z.");
    }

    if (search.length !== length) {
      throw entryError(
        length,
        index,
        `search doit contenir exactement ${length} lettres.`,
      );
    }

    if (
      typeof frequency !== "number" ||
      !Number.isFinite(frequency) ||
      frequency <= 0
    ) {
      throw entryError(length, index, "frequency doit être un nombre positif.");
    }

    if (typeof canBeSolution !== "boolean") {
      throw entryError(length, index, "canBeSolution doit être un booléen.");
    }

    if (searches.has(search)) {
      throw entryError(length, index, `search contient le doublon ${search}.`);
    }
    searches.add(search);

    return {
      id: `${length}-${index.toString(36)}`,
      word,
      search,
      frequency,
      canBeSolution,
    };
  });
}

export async function getWordsByLength(
  length: WordLength,
): Promise<readonly DictionaryWord[]> {
  const loader = DICTIONARY_LOADERS[length];
  if (!loader) {
    throw new Error(`Longueur de mot non prise en charge : ${length}.`);
  }

  return validateWords(await loader(), length);
}
