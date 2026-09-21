import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-(--border) bg-(--card)">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-3 py-3 sm:px-8 sm:py-5">
        <div className="justify-self-start scale-75">
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="justify-self-center whitespace-nowrap rounded-sm text-lg font-semibold tracking-tight text-(--card-foreground) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ring) sm:text-xl"
        >
          Barpat Jeux
        </Link>
        <button
          type="button"
          disabled
          className="justify-self-end cursor-default text-sm font-medium text-(--card-foreground) sm:text-base"
        >
          Connexion
        </button>
      </div>
    </header>
  );
}
