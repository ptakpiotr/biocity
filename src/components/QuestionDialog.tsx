import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { QuestionProps } from "@/Types";
import { Question } from "@/components/Question";

export const QuestionDialog = ({
  place,
  done,
  onDone,
  onClose,
}: QuestionProps & { onClose: () => void }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`question-dialog city-theme-${place.cityId}`}
      aria-label={place.name}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="dialog-toolbar">
        <span>{t(`cities.${place.cityId}.title`)}</span>
        <button type="button" autoFocus onClick={onClose} aria-label={t("question.close")}>
          ×
        </button>
      </div>
      <Question place={place} done={done} onDone={onDone} />
      <button type="button" className="dialog-return" onClick={onClose}>
        {t("question.return")}
      </button>
    </dialog>
  );
};
