import './App.css';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cryptocurrencies from './pages/Cryptocurrencies';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import React from "react";

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/crypto" element={<Cryptocurrencies />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
