import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useLastVisitedRoute } from "@/hooks/useLastVisitedRoute";
import { usePlaces } from "@/hooks/usePlaces";
import { HomePage } from "@/pages/HomePage";
import { ReviewPage } from "@/pages/ReviewPage";

export const AppRoutes = () => {
  const { t } = useTranslation();
  const { places, error, loading } = usePlaces();
  useLastVisitedRoute();

  if (error) return <p role="alert">{t("common.databaseError")}</p>;
  if (loading) return <p role="status">{t("common.loading")}</p>;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage places={places} />} />
        <Route path="miasto/:id" element={<HomePage places={places} />} />
        <Route path="powtorka" element={<ReviewPage places={places} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
