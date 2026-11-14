import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cities } from "@/data/cities";
import { AppIcon } from "@/components/AppIcon";
import type { CityId } from "@/Types";

export const CityTabs = ({ active }: { active: CityId }) => {
  const navigate = useNavigate();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const { t } = useTranslation();

  return (
    <div className="city-tabs" role="tablist" aria-label={t("home.title")}>
      {cities.map((city, index) => (
        <button
          key={city.id}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="button"
          role="tab"
          id={`tab-${city.id}`}
          aria-controls={`city-panel-${city.id}`}
          aria-selected={active === city.id}
          tabIndex={active === city.id ? 0 : -1}
          className={`city-tab city-tab-${city.id}`}
          onClick={() => navigate(`/miasto/${city.id}`)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % cities.length
                : event.key === "ArrowLeft"
                  ? (index + cities.length - 1) % cities.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? cities.length - 1
                      : -1;
            if (next < 0) return;
            event.preventDefault();
            void navigate(`/miasto/${cities[next].id}`);
            refs.current[next]?.focus();
          }}
        >
          <AppIcon name={city.id} />
          <span>{t(`cities.${city.id}.title`)}</span>
        </button>
      ))}
    </div>
  );
};
