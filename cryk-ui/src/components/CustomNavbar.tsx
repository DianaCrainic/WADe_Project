import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./css/CustomNavbar.css";

export default function CustomNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <h2 className="navbar-brand" onClick={() => { navigate(`/`) }}>CRYK</h2>
      </Container>
    </Navbar>
  );
}