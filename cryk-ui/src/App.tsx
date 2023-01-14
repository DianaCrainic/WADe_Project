import React from "react";
import './App.css';
import Cryptocurrencies from './pages/Cryptocurrencies';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CryptoInformation from "./pages/CryptoInformation";

function App() {
  const darkTheme = createTheme({
    palette: {
      type: "dark"
    }
  });

  const id = useParams<string>();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Cryptocurrencies />} />
          <Route
            path="/cryptos/:id"
            element={<CryptoInformation id={id} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;