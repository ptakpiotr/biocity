import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type { PlacesProps } from "@/Types";
import { cities } from "@/data/cities";
import { getCompletedCities } from "@/lib/progress";
import { useProgress } from "@/store/progressStore";
import { CityTabs } from "@/components/CityTabs";
import { CityPage } from "@/pages/CityPage";
import { ReviewLink } from "@/components/ReviewLink";

export const HomePage = ({ places }: PlacesProps) => {
  const { t } = useTranslation();
  const solved = useProgress((state) => state.solved);
  const { id = "plant" } = useParams();
  const active = cities.find((city) => city.id === id)?.id ?? "plant";
  const completed = useMemo(() => getCompletedCities(places, solved), [places, solved]);
  return (
    <>
      <section className="cities">
        <CityTabs active={active} />
        <CityPage key={active} places={places} />
        <ReviewLink unlocked={completed.length === cities.length} />
        <p className="completed-cities">
          {t("home.progress", { count: completed.length, total: cities.length })}
        </p>
      </section>
    </>
  );
};
