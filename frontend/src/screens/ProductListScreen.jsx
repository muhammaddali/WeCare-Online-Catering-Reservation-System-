import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Modal, OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";
import CreateProduct from "./CreateProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [{ loading, error, products, pages, loadingCreate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/admin?page=${page} `,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) { }
    };
    fetchData();
  }, [page, userInfo, show]);

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("Product deleted successfully");
        // Refresh the product list after deletion
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { products: updatedProducts, page, pages },
        });
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Row>
        <Col className="text-start">
          <h1 className="text-black">Products</h1>
        </Col>
        <Col className="text-end col">
          <div>
            <Button type="button" onClick={handleShow}>
              Add Product
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>IN STOCK</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.inStock}</td>
                  <td>{product.category}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </OverlayTrigger>{" "}
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete</Tooltip>}
                    >
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination className="my-4 justify-content-center">
            {[...Array(pages).keys()].map((x) => (
              <Link
                key={x + 1}
                to={{ pathname: "/admin/products", search: `page=${x + 1}` }}
                style={{ cursor: "pointer" }}
              >
                <Pagination.Item active={Number(page) === x + 1}>
                  {x + 1}
                </Pagination.Item>
              </Link>
            ))}
          </Pagination>
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-black">Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateProduct onProductCreate={handleClose} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
