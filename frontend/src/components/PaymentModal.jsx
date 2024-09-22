import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Store } from "../Store";
import LoadingBox from "./LoadingBox";

function PaymentModal({ show, handleClose, orderId, paymentMethod }) {
  const {
    state: { userInfo },
  } = useContext(Store);
  const [cardNumber, setCardNumber] = useState("5123450000000008");
  const [expiryMonth, setExpiryMonth] = useState("01");
  const [expiryYear, setExpiryYear] = useState("39");
  const [cvv, setCvv] = useState("100");
  const [phoneNumber, setPhoneNumber] = useState("03123456789");
  const [cnic, setCnic] = useState("345678");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let payload;

    if (paymentMethod === "card") {
      payload = {
        paymentMethod,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
      };
    } else if (paymentMethod === "mobile") {
      payload = {
        paymentMethod,
        phoneNumber,
        cnic,
      };
    }

    try {
      const { status, data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}/pay`,
        payload,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (status !== 200) {
        console.log(data, data.message);
        throw new Error(data.message);
      }

      toast.success("Payment successful!");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.error(error.response.data.message || error.message);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="text-black">
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {paymentMethod === "card" && (
            <>
              <Form.Group controlId="cardNumber" className="mt-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="expiryMonth" className="mt-3">
                <Form.Label>Expiry Month (MM)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="expiryYear" className="mt-3">
                <Form.Label>Expiry Year (YYYY)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="YYYY"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cvv" className="mt-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          {paymentMethod === "mobile" && (
            <>
              <Form.Group controlId="phoneNumber" className="mt-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cnic" className="mt-3">
                <Form.Label>CNIC (Last 6 digits)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="CNIC (Last 6 digits)"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? <LoadingBox /> : "Pay Now"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default PaymentModal;
