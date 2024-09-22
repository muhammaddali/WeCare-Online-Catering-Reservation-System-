import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [isDelivered, setIsDelivered] = useState(false);

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const approveHandler = async (orderId) => {
    try {
      const { status, data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}`,
        {
          isDelivered: true,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (status !== 200) {
        throw new Error(data.message);
      }
      setIsDelivered(true);
      toast.success("Order successfully approved.");
    } catch (error) {
      toast.error(
        `Error approving order: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  const deleteHandler = async (orderId) => {
    try {
      const { status, data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (status !== 204) {
        throw new Error(data.message);
      }

      toast.success("Order successfully deleted.");
    } catch (error) {
      toast.error(
        `Error deleting order: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIEVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="align-middle">{order._id}</td>
                <td className="align-middle">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="align-middle">{order.totalPrice.toFixed(2)}</td>
                <td className="align-middle">
                  {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                </td>
                <td className="align-middle">
                  {order.isDelivered ? "Yes" : "No"}
                </td>
                <td className="align-middle">
                  {userInfo?.isAdmin && (
                    <>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="position-fixed">Aprove</Tooltip>
                        }
                      >
                        <Button
                          type="button"
                          variant="success"
                          size="sm"
                          disabled={order.isDelivered || isDelivered}
                          onClick={() => approveHandler(order._id)}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="position-fixed">Delete</Tooltip>
                        }
                      >
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          className="mx-2"
                          disabled={order.isDelivered || isDelivered}
                          onClick={() => deleteHandler(order._id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </OverlayTrigger>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
