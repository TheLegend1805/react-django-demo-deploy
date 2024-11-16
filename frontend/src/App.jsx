import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../src/pages/Register";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import ProtectedRoutes from "../src/components/ProtectedRoutes";
import NotFound from "../src/pages/NotFound";

const Logout = () => {
  localStorage.clear();
  return <Navigate to={"/login"} />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
