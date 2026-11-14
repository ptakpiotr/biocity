import { AppIcon } from "@/components/AppIcon";
import { useTranslation } from "react-i18next";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Link, Outlet } from "react-router-dom";
import { useProgress } from "@/store/progressStore";
import { ResetProgress } from "@/components/ResetProgress";
import { TeamSetup } from "@/components/TeamSetup";
import { progressStorage } from "@/store/progressStorage";

export const AppLayout = () => {
  const { t } = useTranslation();
  const persistent = useSyncExternalStore(progressStorage.subscribe, progressStorage.getSnapshot);
  const [confirmReset, setConfirmReset] = useState(false);
  const reset = useProgress((state) => state.reset);
  const team = useProgress((state) => state.team);
  const [editingTeam, setEditingTeam] = useState(false);

  const handleReset = useCallback(() => {
    reset();
    setConfirmReset(false);
  }, [reset]);

  const handleOpenReset = useCallback(() => setConfirmReset(true), []);
  const handleCancelReset = useCallback(() => setConfirmReset(false), []);

  return (
    <main className="app-shell">
      <header>
        <Link className="brand" to="/">
          <AppIcon name="brand" /> {t("app.name")}
        </Link>
        {team && (
          <>
            <button type="button" className="reset" onClick={handleOpenReset}>
              <AppIcon name="reset" />
              {t("header.reset")}
            </button>
            <button
              type="button"
              className="team-badge"
              onClick={() => {
                setConfirmReset(false);
                setEditingTeam(true);
              }}
              aria-label={t("team.edit", { name: team.name })}
              title={t("team.edit", { name: team.name })}
            >
              <span className={`team-badge-icon team-color-${team.icon}`}>
                <AppIcon name={team.icon} />
              </span>
              <strong>{team.name}</strong>
            </button>
          </>
        )}
      </header>
      {!persistent && (
        <p className="notice" role="status">
          {t("common.storageUnavailable")}
        </p>
      )}
      {confirmReset && <ResetProgress onConfirm={handleReset} onCancel={handleCancelReset} />}
      {!team || editingTeam ? <TeamSetup onDone={() => setEditingTeam(false)} /> : <Outlet />}
    </main>
  );
};
