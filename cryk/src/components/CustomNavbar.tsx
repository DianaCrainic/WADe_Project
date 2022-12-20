import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function CustomNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">Cryk</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/crypto">Cryptocurrencies</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}