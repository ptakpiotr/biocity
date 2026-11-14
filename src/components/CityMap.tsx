import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ButtonClickEvent, CityMapProps, CityScene } from "@/Types";
import { createCityScene } from "@/pixi/createCityScene";
import { useHotkey } from "@tanstack/react-hotkeys";

export const CityMap = memo(({ places, solved, selected, onSelect }: CityMapProps) => {
  const { t } = useTranslation();
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const scene = useRef<CityScene | null>(null);
  const fullscreenTransition = useRef(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const city = places[0]?.cityId ?? "plant";
  const count = places.filter((place) => solved.includes(place.id)).length;
  const handleSelect = useCallback(
    (event: ButtonClickEvent) => {
      const id = event.currentTarget.dataset.placeId;
      if (id) onSelect(id);
    },
    [onSelect],
  );
  const fullscreen = useCallback(async () => {
    if (fullscreenTransition.current) return;
    if (expanded) {
      setExpanded(false);
      return;
    }
    fullscreenTransition.current = true;
    const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
    const focused = document.activeElement;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await frame.current?.requestFullscreen();
      // Keep an open question above the fullscreen layer.
      if (dialog?.isConnected) {
        if (dialog.open) dialog.close();
        dialog.showModal();
        if (focused instanceof HTMLElement && dialog.contains(focused)) focused.focus();
      }
    } catch {
      if (frame.current) setExpanded(true);
    } finally {
      fullscreenTransition.current = false;
    }
  }, [expanded]);

  useHotkey(
    "F",
    () => {
      void fullscreen();
    },
    { preventDefault: true, ignoreInputs: true, requireReset: true },
  );
  useHotkey("Escape", () => setExpanded(false), {
    enabled: expanded && !selected,
    preventDefault: true,
  });

  useEffect(() => {
    if (!expanded) return;
    const previous = document.documentElement.style.overflow;
    const previousFocus = document.activeElement;
    const siblings: { element: HTMLElement; inert: boolean }[] = [];
    let branch: HTMLElement | null = frame.current;
    while (branch && branch !== document.body) {
      for (const sibling of branch.parentElement?.children ?? []) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== branch &&
          !(sibling instanceof HTMLDialogElement)
        ) {
          siblings.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    document.documentElement.style.overflow = "hidden";
    if (!document.querySelector("dialog[open]")) frame.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = previous;
      for (const { element, inert } of siblings) element.inert = inert;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [expanded]);

  useEffect(() => {
    if (!host.current) return;
    let active = true;
    setFailed(false);
    setReady(false);
    const instance = createCityScene({ host: host.current, places: [], solved: [], onSelect });
    scene.current = instance;
    void instance.ready
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
      instance.destroy();
      scene.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    scene.current?.update(places, solved, selected);
  }, [places, solved, selected, onSelect]);

  return (
    <div
      ref={frame}
      tabIndex={-1}
      className={`map-wrap map-theme-${city}${expanded ? " map-fullscreen" : ""}`}
    >
      <div className="map-toolbar">
        <div>
          <strong>{t(`cities.${city}.title`)}</strong>
        </div>
        <div>
          <span className="map-progress">{t("map.progress", { count, total: places.length })}</span>
          <button
            type="button"
            onClick={fullscreen}
            aria-label={t("map.fullscreen")}
            aria-keyshortcuts="f"
            title={t("map.fullscreen")}
          >
            ⛶ <kbd>F</kbd>
          </button>
        </div>
      </div>
      <div className="map-scroll" tabIndex={0} role="region" aria-label={t("map.region")}>
        <div className="map-stage">
          <div ref={host} className="pixi-map" aria-hidden="true" />
          {!ready && !failed && (
            <div className="map-loading" role="status">
              {t("map.loading")}
            </div>
          )}
        </div>
      </div>
      {failed && <p role="alert">{t("map.unavailable")}</p>}
      <p className="map-keyboard-hint">
        {t("map.hint")}{" "}
        <span>
          <kbd>1-{Math.min(places.length, 9)}</kbd> {t("map.numberShortcut")}
        </span>
      </p>
      <div className="map-labels" aria-label={t("map.legend")}>
        {places.map((place, index) => (
          <button
            key={place.id}
            data-place-id={place.id}
            onClick={handleSelect}
            aria-pressed={selected === place.id}
            aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
            className={`map-legend-item ${solved.includes(place.id) ? "done" : ""}`}
          >
            <span>{solved.includes(place.id) ? "✓" : String(index + 1).padStart(2, "0")}</span>
            {place.name}
          </button>
        ))}
      </div>
    </div>
  );
});
