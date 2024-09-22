import React, { useState } from "react";
import {
  Navbar,
  Container,
  NavbarBrand,
  Nav,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";

const Header = ({ cart, userInfo, signoutHandler }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="border-bottom">
      <Navbar expand="lg" className="px-5 text-white">
        <Container fluid>
          <NavbarBrand className="text-primary" as={Link} to={"/"}>
            <img
              alt=""
              src="../../favicon.png"
              width="50"
              height="50"
              className="d-inline-block"
              style={{ marginRight: "-1rem" }}
            />
            WeCare
          </NavbarBrand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <SearchBox />
            {!userInfo?.isAdmin && (
              <Nav className="mx-2">
                <Link
                  to="/cart"
                  className="text-primary text-decoration-none lg nav-link"
                >
                  <FontAwesomeIcon icon={faShoppingBag} size="lg" />
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
            )}
            <Nav>
              {userInfo ? (
                <NavDropdown title={userInfo.name} align={"end"}>
                  <NavDropdown.Item as={Link} to={"/profile"}>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={"/orderhistory"}>
                    Orders
                  </NavDropdown.Item>
                  {userInfo?.isAdmin && (
                    <>
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/products">
                        Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/users">
                        Users
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign in
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
