import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAppBackNavigation(fallbackPath = "/home") {
  const navigate = useNavigate();

  return useCallback(() => {
    navigate(fallbackPath, { replace: true });
  }, [fallbackPath, navigate]);
}
