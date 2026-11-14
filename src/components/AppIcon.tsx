import { memo } from "react";
import {
  LuBookOpen,
  LuBrain,
  LuBuilding2,
  LuCastle,
  LuDna,
  LuDoorOpen,
  LuFactory,
  LuLandmark,
  LuLeaf,
  LuLockKeyhole,
  LuNetwork,
  LuPawPrint,
  LuSparkles,
  LuSprout,
  LuWarehouse,
  LuWaves,
  LuZap,
  LuRotateCcw,
  LuRocket,
  LuCat,
  LuFlame,
  LuTurtle,
} from "react-icons/lu";
import type { AppIconProps, IconRegistry } from "@/Types";

const icons: IconRegistry = {
  brand: LuDna,
  reset: LuRotateCcw,
  rocket: LuRocket,
  cat: LuCat,
  flame: LuFlame,
  turtle: LuTurtle,
  city: LuBuilding2,
  plant: LuLeaf,
  animal: LuPawPrint,
  wall: LuCastle,
  gate: LuDoorOpen,
  power: LuZap,
  store: LuWarehouse,
  farm: LuSprout,
  hall: LuLandmark,
  network: LuNetwork,
  factory: LuFactory,
  water: LuWaves,
  library: LuBookOpen,
  review: LuBrain,
  lock: LuLockKeyhole,
  sparkles: LuSparkles,
};

export const AppIcon = memo(({ name, className }: AppIconProps) => {
  if (name === "bacteria")
    return (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <g transform="rotate(-35 15 15)">
          <rect x="5" y="9" width="21" height="12" rx="6" />
          <path d="M11 13c2-3 2 7 5 3s3-3 4 1M9 8V5m7 3V4m7 5V6M9 22v3m7-3v4m7-5v3M4 13H1m3 5H2" />
          <circle cx="22" cy="13" r=".6" fill="currentColor" stroke="none" />
        </g>
        <path d="M25 11c6-2 0-8 5-9" />
      </svg>
    );
  const Icon = icons[name] ?? LuBuilding2;

  return <Icon className={className} size="1em" aria-hidden="true" focusable="false" />;
});
