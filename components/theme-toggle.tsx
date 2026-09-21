"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

// Adapted from the MIT-licensed switch by jubayer-10 on Uiverse.io.
export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? isDark
      ? "Activer le thème clair"
      : "Activer le thème sombre"
    : "Changer de thème";

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isDark}
        disabled={!mounted}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label={label}
      />
      <span className="relative h-[40px] w-[88px] rounded-full bg-white shadow-sm duration-300 after:absolute after:left-[4px] after:top-[4px] after:h-[32px] after:w-[32px] after:rounded-full after:bg-gradient-to-r after:from-orange-500 after:to-yellow-400 after:shadow-md after:duration-300 after:content-[''] peer-checked:bg-zinc-500 peer-checked:after:left-[84px] peer-checked:after:-translate-x-full peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 peer-active:after:w-[40px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--ring)] motion-reduce:duration-0 motion-reduce:after:duration-0 sm:h-[50px] sm:w-[110px] sm:after:left-[5px] sm:after:top-[5px] sm:after:h-[40px] sm:after:w-[40px] sm:peer-checked:after:left-[105px] sm:peer-active:after:w-[50px]" />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute left-[10px] h-5 w-5 fill-white peer-checked:opacity-60 sm:left-[13px] sm:h-6 sm:w-6"
      >
        <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm1-17h-2v5h2V0Zm0 19h-2v5h2v-5ZM5 11H0v2h5v-2Zm19 0h-5v2h5v-2Zm-2.81-6.78-1.41-1.41-3.54 3.54 1.41 1.41 3.54-3.54ZM7.76 17.66l-1.41-1.41-3.54 3.54 1.41 1.41 3.54-3.54Zm0-11.31L4.22 2.81 2.81 4.22l3.54 3.54 1.41-1.41Zm13.44 13.44-3.54-3.54-1.41 1.41 3.54 3.54 1.41-1.41Z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute right-[10px] h-5 w-5 fill-black opacity-60 peer-checked:fill-white peer-checked:opacity-70 sm:right-[13px] sm:h-6 sm:w-6"
      >
        <path d="M12.009 24A12.067 12.067 0 0 1 .075 10.725 12.121 12.121 0 0 1 10.1.152a13 13 0 0 1 5.03.206 2.5 2.5 0 0 1 1.8 1.8 2.47 2.47 0 0 1-.7 2.425c-4.559 4.168-4.165 10.645.807 14.412a2.5 2.5 0 0 1-.7 4.319A13.875 13.875 0 0 1 12.009 24Zm.074-22a10.776 10.776 0 0 0-1.675.127 10.1 10.1 0 0 0-8.344 8.8A9.928 9.928 0 0 0 4.581 18.7a10.473 10.473 0 0 0 11.093 2.734.5.5 0 0 0 .138-.856C9.883 16.1 9.417 8.087 14.865 3.124a.459.459 0 0 0 .127-.465.491.491 0 0 0-.356-.362A10.68 10.68 0 0 0 12.083 2ZM20.5 12a1 1 0 0 1-.97-.757l-.358-1.43-1.432-.385a1 1 0 0 1 .035-1.94l1.4-.325.351-1.406a1 1 0 0 1 1.94 0l.355 1.418 1.418.355a1 1 0 0 1 0 1.94l-1.418.355-.355 1.418A1 1 0 0 1 20.5 12ZM16 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm6 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" />
      </svg>
    </label>
  );
}
