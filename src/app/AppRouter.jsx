import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD
import WelcomePage from "../pages/WelcomePage/WelcomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
// import HomePage from "../pages/HomePage/HomePage";

=======
import WelcomePage from "@/pages/WelcomePage/WelcomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
>>>>>>> c81a0bd3db7d5f654213b9f5f9103a1151f5da4e
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD

=======
>>>>>>> c81a0bd3db7d5f654213b9f5f9103a1151f5da4e
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
