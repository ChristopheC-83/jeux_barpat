import Image from "next/image";
import Link from "next/link";

import { games } from "@/lib/games";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        À quoi joue-t-on ?
      </h1>

      <ul className="mt-8 flex flex-col gap-4 sm:mt-10">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              href={game.route}
              className="group relative isolate flex min-h-28 items-center overflow-hidden rounded-(--radius) border border-(--border) px-6 py-5 text-xl font-semibold text-white shadow-sm transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-(--muted-foreground) hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ring) active:translate-y-0 active:scale-[0.99] active:shadow-sm motion-reduce:transform-none motion-reduce:transition-none sm:min-h-32"
            >
              <Image
                src={game.thumbnail}
                alt=""
                fill
                sizes="(max-width: 640px) calc(100vw - 2.5rem), 608px"
                className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] group-active:scale-[1.01] motion-reduce:transform-none motion-reduce:transition-none"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 z-10 transition-opacity duration-200 ease-out group-hover:opacity-90  group-focus-visible:opacity-90 group-active:opacity-100 motion-reduce:transition-none"
                style={{ background: game.overlay }}
              />
              <span className="relative z-20 ">
                {game.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
