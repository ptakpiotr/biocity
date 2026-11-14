import { getQuestionKey } from "@/lib/questions";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { PlacesProps } from "@/Types";
import { cities } from "@/data/cities";
import { useProgress } from "@/store/progressStore";
import { QuestionDialog } from "@/components/QuestionDialog";

const EMPTY_SOLVED: string[] = [];
const CityMap = lazy(() =>
  import("@/components/CityMap").then((module) => ({ default: module.CityMap })),
);
const QUESTION_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const CityPage = ({ places }: PlacesProps) => {
  const { t } = useTranslation();
  const { id = "plant" } = useParams();
  const city = cities.find((item) => item.id === id);
  const items = useMemo(
    () => places.filter((place) => place.cells.includes(id ?? "")),
    [places, id],
  );
  const solved = useProgress((state) => state.solved[id ?? ""] ?? EMPTY_SOLVED);
  const resetVersion = useProgress((state) => state.resetVersion);
  const solve = useProgress((state) => state.solve);
  const [selected, setSelected] = useState<string | null>(null);
  const select = useCallback((placeId: string) => setSelected(placeId), []);
  const close = useCallback(() => setSelected(null), []);
  const place = items.find((item) => item.id === selected);
  const count = useMemo(
    () => items.filter((item) => solved.includes(item.id)).length,
    [items, solved],
  );

  useHotkeys(
    items.slice(0, QUESTION_KEYS.length).map((item, index) => ({
      hotkey: QUESTION_KEYS[index],
      callback: () => setSelected((current) => (current === item.id ? null : item.id)),
      options: { requireReset: true },
    })),
    { enabled: Boolean(city), preventDefault: true, ignoreInputs: true },
  );

  const solveSelected = useCallback(() => {
    if (city && place) solve(city.id, place.id);
  }, [city, place, solve]);

  if (!city) return <Navigate to="/" replace />;

  return (
    <section
      role="tabpanel"
      id={`city-panel-${city.id}`}
      aria-labelledby={`tab-${city.id}`}
      className={`city-view city-theme-${city.id}`}
    >
      <Suspense fallback={<p role="status">{t("map.loading")}</p>}>
        <CityMap places={items} solved={solved} selected={selected} onSelect={select} />
      </Suspense>
      {place && (
        <QuestionDialog
          key={`${resetVersion}:${getQuestionKey(place)}`}
          place={place}
          done={solved.includes(place.id)}
          onDone={solveSelected}
          onClose={close}
        />
      )}
      {count === items.length && (
        <p className="notice" role="status">
          {t("city.finished")}
        </p>
      )}
    </section>
  );
};
