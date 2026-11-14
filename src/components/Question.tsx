import { AppIcon } from "@/components/AppIcon";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ButtonClickEvent, QuestionProps } from "@/Types";
import { isQuestionReady } from "@/lib/questions";

export const Question = memo(({ place, done, onDone }: QuestionProps) => {
  const { t } = useTranslation();
  const [choice, setChoice] = useState<number | null>(null);
  const configured = isQuestionReady(place);

  const handleAnswer = useCallback(
    (event: ButtonClickEvent) => {
      if (!configured || done) return;
      const index = Number(event.currentTarget.dataset.answerIndex);
      if (!Number.isInteger(index) || index < 0 || index > 3) return;
      setChoice(index);
      if (index === place.correct) onDone();
    },
    [configured, done, place.correct, onDone],
  );

  return (
    <section className="question-card">
      <div className="big-icon">
        <AppIcon name={place.id} />
      </div>
      <h2>{place.name}</h2>
      <h3>{place.question}</h3>
      {!configured && <p>{t("question.placeholder")}</p>}
      <div className="answers">
        {place.options.map((option, index) => (
          <button
            key={index}
            className={`answer ${choice === index ? "selected" : ""}`}
            disabled={!configured || done}
            aria-label={t(option ? "question.answerLabelWithText" : "question.answerLabel", {
              letter: "ABCD"[index],
              text: option,
            })}
            data-answer-index={index}
            onClick={handleAnswer}
          >
            <b>{"ABCD"[index]}</b>
            {option}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {done ? (
          <p className="feedback">
            {t("question.correct", { organelle: place.organelle, explanation: place.text })}
          </p>
        ) : (
          choice !== null && <p className="feedback">{t("question.incorrect")}</p>
        )}
      </div>
    </section>
  );
});
