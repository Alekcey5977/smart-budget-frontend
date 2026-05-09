import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAppBackNavigation(fallbackPath = "/home") {
  const navigate = useNavigate();

  return useCallback(() => {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  }, [fallbackPath, navigate]);
}
