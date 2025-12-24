import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage/WelcomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage/HomePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
