import React from "react";
import './App.css';
import Cryptocurrencies from './pages/Cryptocurrencies';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  const darkTheme = createTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Cryptocurrencies />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;