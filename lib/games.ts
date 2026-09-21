import type { StaticImageData } from "next/image";

import leMotThumbnail from "@/app/jeux/le-mot/images/thumbnail.png";
import lePenduThumbnail from "@/app/jeux/le-pendu/images/thumbnail.png";
import motusThumbnail from "@/app/jeux/motus/images/thumbnail.png";

export type Game = {
  id: string;
  name: string;
  route: string;
  thumbnail: StaticImageData;
  overlay: string;
};

export const games = [
  {
    id: "le-mot",
    name: "Le Mot",
    route: "/jeux/le-mot",
    thumbnail: leMotThumbnail,
    overlay:
      "linear-gradient(90deg, rgba(18, 17, 15, 0.76) 0%, rgba(18, 17, 15, 0.5) 62%, rgba(18, 17, 15, 0.36) 100%)",
  },
  {
    id: "motus",
    name: "Motus",
    route: "/jeux/motus",
    thumbnail: motusThumbnail,
    overlay:
      "linear-gradient(90deg, rgba(45, 9, 13, 0.76) 0%, rgba(45, 9, 13, 0.5) 62%, rgba(45, 9, 13, 0.34) 100%)",
  },
  {
    id: "le-pendu",
    name: "Le Pendu",
    route: "/jeux/le-pendu",
    thumbnail: lePenduThumbnail,
    overlay:
      "linear-gradient(90deg, rgba(6, 20, 23, 0.78) 0%, rgba(6, 20, 23, 0.52) 62%, rgba(6, 20, 23, 0.36) 100%)",
  },
] as const satisfies readonly Game[];
