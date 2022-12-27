import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./css/CustomNavbar.css";

export default function CustomNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand className="me-auto" py-lg-0 href="/">CRYK</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      </Container>
    </Navbar>
  );
}