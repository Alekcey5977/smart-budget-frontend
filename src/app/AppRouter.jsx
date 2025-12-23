import { Routes, Route, Navigate } from "react-router-dom";
import UnauthLayout from "../layout/UnauthLayout";

import WelcomePage from "../pages/WelcomePage/WelcomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <UnauthLayout>
            <WelcomePage />
          </UnauthLayout>
        }
      />

      <Route
        path="/login"
        element={
          <UnauthLayout showBack>
            <LoginPage />
          </UnauthLayout>
        }
      />

      <Route
        path="/home"
        element={
          <UnauthLayout showBack>
            <HomePage />
          </UnauthLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
