import React, { createContext, useState } from "react";
import "./App.css";
import Cryptocurrencies from "./pages/Cryptocurrencies";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import CryptoInformation from "./pages/CryptoInformation";
import CryptocurrenciesVisualizations from "./pages/CryptocurrenciesVisualizations";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PageNotFound from "./pages/PageNotFound";
import Footer from "./components/Footer";

export const AuthContext = createContext(false);

function App() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: "dark"
    }
  });

  const id = useParams<string>();

  return (
    <ThemeProvider theme={darkTheme}>
      <AuthContext.Provider value={isAdminAuth}>
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
            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Routes>
        </Router>
        <Footer setIsAdminAuth={setIsAdminAuth} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;