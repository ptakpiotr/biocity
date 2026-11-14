import { AppIcon } from "@/components/AppIcon";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { ReviewLinkProps } from "@/Types";

export const ReviewLink = ({ unlocked }: ReviewLinkProps) => {
  const { t } = useTranslation();

  if (unlocked) {
    return (
      <Link className="review unlocked" to="/powtorka">
        <span className="review-icon">
          <AppIcon name="review" />
        </span>
        <span>
          <b>{t("review.title")}</b>
          <small>{t("review.description")}</small>
        </span>
      </Link>
    );
  }

  return (
    <button className="review" disabled>
      <span className="review-icon">
        <AppIcon name="lock" />
      </span>
      <span>
        <b>{t("review.title")}</b>
        <small>{t("review.locked")}</small>
      </span>
    </button>
  );
};
