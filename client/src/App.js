import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login/Login";
import Settings from "./Components/Settings/Settings";
import './App.css';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/" ) {
      document.body.classList.add("login-page");
      document.body.classList.remove("other-page");
    } else {
      document.body.classList.add("other-page");
      document.body.classList.remove("login-page");
    }
  }, [location]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
