/* eslint-disable no-unused-vars */
import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'


function NavBar() {
    return (
        <Navbar collapseOnSelect expand="sm" variant="dark" style={{backgroundColor: "#e09e02"}}>
            <Navbar.Brand href="#home">Motivate Me</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Item href="/">Home</NavDropdown.Item>
                  <NavDropdown.Item href="/update-profile">Update Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/signup">Signup</NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
              <Nav>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/update-profile">Profile</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
    )
}

export default NavBar
