import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadDashboard from "./pages/AdminDashboard";
import UpdateProfile from "./pages/UpdateProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/reset-password" element={<ForgotPassword />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<UploadDashboard />} />
        <Route path="/profile" element={<UpdateProfile />} />


      </Routes>
    </Router>
  );
}

export default App;
