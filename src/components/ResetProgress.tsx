import { useTranslation } from "react-i18next";
import type { ResetProgressProps } from "@/Types";

export const ResetProgress = ({ onConfirm, onCancel }: ResetProgressProps) => {
  const { t } = useTranslation();
  return (
    <div className="notice reset-confirmation">
      <p>{t("reset.question")}</p>
      <div className="reset-actions">
        <button type="button" className="primary" onClick={onConfirm}>
          {t("reset.confirm")}
        </button>
        <button type="button" className="reset-cancel" onClick={onCancel}>
          {t("reset.cancel")}
        </button>
      </div>
    </div>
  );
};
