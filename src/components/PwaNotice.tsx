import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

export const PwaNotice = () => {
  const { t } = useTranslation();
  const [updateFailed, setUpdateFailed] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // Development serves source modules on demand; only a production build
  // precaches everything needed to play offline.
  if (!needRefresh && (!offlineReady || import.meta.env.DEV)) return null;

  const dismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setUpdateFailed(false);
  };
  const update = async () => {
    setUpdateFailed(false);
    try {
      await updateServiceWorker();
    } catch {
      setUpdateFailed(true);
    }
  };

  return (
    <aside className="pwa-notice" aria-label={t("pwa.title")}>
      <p role="status">{t(needRefresh ? "pwa.updateReady" : "pwa.offlineReady")}</p>
      {updateFailed && <p role="alert">{t("pwa.updateFailed")}</p>}
      <div className="pwa-actions">
        {needRefresh && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              void update();
            }}
          >
            {t("pwa.update")}
          </button>
        )}
        <button type="button" onClick={dismiss}>
          {t(needRefresh ? "pwa.later" : "pwa.close")}
        </button>
      </div>
    </aside>
  );
};
