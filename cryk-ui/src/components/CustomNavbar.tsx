import React from "react";
import { Container, Navbar } from "react-bootstrap";
import "./css/CustomNavbar.css";

export default function CustomNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand className="me-auto" href="/">CRYK</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      </Container>
    </Navbar>
  );
}