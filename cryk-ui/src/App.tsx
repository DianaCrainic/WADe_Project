import React from "react";
import './App.css';
import Cryptocurrencies from './pages/Cryptocurrencies';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import CryptoInformation from "./pages/CryptoInformation";
import CryptocurrenciesVisualizations from "./pages/CryptocurrenciesVisualizations";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark"
    }
  });

  const id = useParams<string>();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <CustomNavbar />
        <Routes>
          <Route
            path="/"
            element={<Cryptocurrencies />}
          />
          <Route
            path="/cryptos/:id"
            element={<CryptoInformation id={id} />}
          />
          <Route
            path="/cryptos/visualizations"
            element={<CryptocurrenciesVisualizations />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;