import type { Table } from "dexie";
export type CityId = "plant" | "animal" | "bacteria";
export interface City {
  id: CityId;
  icon: string;
}

export interface Place {
  questionId: string;
  cityId: CityId;
  id: string;
  icon: string;
  name: string;
  organelle: string;
  text: string;
  cells: string[];
  question: string;
  options: string[];
  correct: number;
}

export interface DatabaseTables {
  places: Table<LegacyPlace, string>;
  cityPlaces: Table<Place, string>;
}

export interface Progress {
  team: TeamProfile | null;
  setTeam: (team: TeamProfile) => void;
  resetVersion: number;
  solved: Record<string, string[]>;
  review: string[];
  lastPath: string;
  solve: (city: string, id: string) => void;
  solveReview: (id: string) => void;
  visit: (path: string) => void;
  reset: () => void;
}

export interface PlacesProps {
  places: Place[];
}

export interface QuestionProps {
  place: Place;
  done: boolean;
  onDone: () => void;
}

export interface CityMapProps extends PlacesProps {
  selected?: string | null;
  solved: string[];
  onSelect: (id: string) => void;
}

export interface ReviewLinkProps {
  unlocked: boolean;
}

export interface ResetProgressProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CitySceneOptions {
  host: HTMLDivElement;
  places: Place[];
  solved: string[];
  onSelect: (id: string) => void;
}

export interface CityScene {
  ready: Promise<void>;
  update: (places: Place[], solved: string[], selected?: string | null) => void;
  destroy: () => void;
}

export interface PlacesSnapshot {
  places: Place[];
  loading: boolean;
  error: boolean;
}

export type StoreListener = () => void;
export type ButtonClickEvent = import("react").MouseEvent<HTMLButtonElement>;

export interface AppIconProps {
  name: string;
  className?: string;
}

export type IconRegistry = Record<string, import("react-icons").IconType>;

export type TeamIcon = "rocket" | "cat" | "flame" | "turtle";
export interface TeamProfile {
  name: string;
  icon: TeamIcon;
}
export type ProgressData = Pick<Progress, "solved" | "review" | "lastPath" | "team">;

export type LegacyPlace = Omit<Place, "questionId" | "cityId">;

export type QuestionContent = Pick<
  Place,
  "questionId" | "cityId" | "question" | "options" | "correct"
> & {
  buildingId: string;
};
