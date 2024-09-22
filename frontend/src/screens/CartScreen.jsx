import axios from "axios";
import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import MessageBox from "../components/MessageBox";

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  // Update cart
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/products/${item._id}`
    );
    if (data.inStock < quantity) {
      window.alert(
        "Sorry, you have reached the maximum quantity for this item."
      );
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  // Remove item
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  // Proceed to checkout
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-black">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Your cart is empty. <Link to="/products">Shop dishes</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={
                          item.image || "https://via.placeholder.com/300x200"
                        }
                        alt={item.name}
                        className="rounded img-fluid img-thumbnail"
                      />{" "}
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      <Button
                        variant="primary"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fa-minus-circle fas"></i>
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant="primary"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.inStock}
                      >
                        <i className="fa-plus-circle fas"></i>
                      </Button>
                    </Col>
                    <Col md={2}>
                      {import.meta.env.VITE_CURRENCY} {item.price}
                    </Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="primary"
                      >
                        <i className="fa-trash fas"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                {/* SUBTOTAL */}
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce(
                      (accumulator, current) => accumulator + current.quantity,
                      0
                    )}{" "}
                    items) : {import.meta.env.VITE_CURRENCY}
                    {cartItems
                      .reduce((a, c) => a + parseFloat(c.price * c.quantity), 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                {/* PROCEED TO CHECKOUT */}
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={userInfo?.isAdmin || cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
