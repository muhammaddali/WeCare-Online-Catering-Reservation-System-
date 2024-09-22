import Axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";
import { Form, FormGroup, Modal } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [cateringTotal, setCateringTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState(0);
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      console.log({
        orderItems: cart.cartItems.map((item) => item._id),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice + cateringTotal,
      });


      const { data, status } = await Axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/orders`,
        {
          orderItems: cart.cartItems.map((item) => item._id),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice + cateringTotal,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (status !== 201) {
        throw Error(data.message);
      }

      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const handleNeedCatering = () => {
    setShowModal(!showModal);
  }

  const handleGuestSubmit = () => {
    handleNeedCatering();
    placeOrderHandler();
  }

  const handleGuestChange = (e) => {
    setGuests(e.target.value);
    setCateringTotal(e.target.value * 300);
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3 text-black">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="text-black">Shipping</Card.Title>
              <Card.Text className="text-black">
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="text-black">Payment</Card.Title>
              <Card.Text className="text-black">
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="text-black">Items</Card.Title>
              <ListGroup variant="flush" className="text-black">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded img-fluid img-thumbnail"
                        />
                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        {import.meta.env.VITE_CURRENCY}
                        {item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-black">Order Summary</Card.Title>
              <ListGroup variant="flush" className="text-black">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>
                      {import.meta.env.VITE_CURRENCY}
                      {cart.itemsPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {import.meta.env.VITE_CURRENCY}
                      {cart.shippingPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="text-black">
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      {import.meta.env.VITE_CURRENCY}
                      {cart.taxPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {(cateringTotal > 0 && guests >= 19) && <ListGroup.Item className="text-black">
                  <Row>
                    <Col>{`Catering (300 * ${guests})`}</Col>
                    <Col>
                      {import.meta.env.VITE_CURRENCY}
                      {guests * 300}
                    </Col>
                  </Row>
                </ListGroup.Item>}
                <ListGroup.Item className="text-black">
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>
                        {import.meta.env.VITE_CURRENCY}
                        {(cart.totalPrice + (cateringTotal)).toFixed(2)}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="text-black">
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={handleNeedCatering}
                      disabled={cart.cartItems.length === 0 || loading}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={handleNeedCatering}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title className="text-black">Number of Guests?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <Form.Control type="number" min={19} value={guests} onChange={handleGuestChange} isInvalid={guests < 19} />
              <Form.Control.Feedback type="invalid" className="mt-3">Catering service requires a minimum of 19 guests.</Form.Control.Feedback>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleGuestSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
