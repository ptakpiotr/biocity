import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "@/store/progressStore";
export const useLastVisitedRoute = () => {
  const { pathname } = useLocation();
  const visit = useProgress((state) => state.visit);
  useEffect(() => {
    if (pathname.startsWith("/miasto/") || pathname === "/powtorka") {
      visit(pathname);
    }
  }, [pathname, visit]);
};
