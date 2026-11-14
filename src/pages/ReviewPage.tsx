import { getQuestionKey } from "@/lib/questions";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import type { PlacesProps } from "@/Types";
import { cities } from "@/data/cities";
import { getCompletedCities, getReviewProgress } from "@/lib/progress";
import { useProgress } from "@/store/progressStore";
import { Question } from "@/components/Question";

export const ReviewPage = ({ places }: PlacesProps) => {
  const { t } = useTranslation();
  const solved = useProgress((state) => state.solved);
  const review = useProgress((state) => state.review);
  const solveReview = useProgress((state) => state.solveReview);
  const unlocked = useMemo(
    () => getCompletedCities(places, solved).length === cities.length,
    [places, solved],
  );
  const { pending, count, total } = useMemo(
    () => getReviewProgress(places, review),
    [places, review],
  );
  const solvePending = useCallback(() => {
    if (pending) solveReview(pending.questionId);
  }, [pending, solveReview]);

  if (!unlocked) return <Navigate to="/" replace />;
  return (
    <section className="quiz-view">
      <Link className="back" to="/">
        {t("common.back")}
      </Link>
      <h1>{t("review.title")}</h1>
      {pending && <p>{t(`cities.${pending.cityId}.title`)}</p>}
      <p>{t("review.progress", { count, total })}</p>
      {pending ? (
        <Question
          key={getQuestionKey(pending)}
          place={pending}
          done={false}
          onDone={solvePending}
        />
      ) : (
        <p className="notice" role="status">
          {t("review.finished")}
        </p>
      )}
    </section>
  );
};
