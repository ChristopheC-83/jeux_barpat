import { LeMotGame } from "@/app/jeux/le-mot/components/le-mot-game";
import { getWordsByLength } from "@/app/data/words";

export default async function LeMotPage() {
  const words = await getWordsByLength(5);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 justify-center px-3 py-8 sm:px-8 sm:py-12">
      <LeMotGame wordLength={5} words={words} />
    </main>
  );
}
