import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { makeStyles } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";

const useTheme = makeStyles((theme) => ({
  palette: {
    color: "0b5394"
  },
}));

// const useTheme = {
//   palette: {
//     color: "0b5394"
//   },
// };

export default function CustomNavbar() {
  const theme = useTheme();
  // const theme = createTheme(useTheme);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
    {/* <Navbar collapseOnSelect expand="lg" color={{ "0b5394"}}> */}

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