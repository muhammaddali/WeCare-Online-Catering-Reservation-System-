import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import {
  Card,
  Form,
  Image,
  ListGroup,
  Pagination,
  Stack,
} from "react-bootstrap";
import { Store } from "../Store";

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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const location = useLocation();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const truncateDescription = (text) => {
    if (text.length > 90) {
      return text.slice(0, 90) + "...";
    }
    return text;
  };

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/products/search?page=${page}&query=${query}&category=${category}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, query]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const sortOrder = filter.order || order;

    return {
      pathname: "/search",
      search: `?category=${filterCategory}&query=${filterQuery}&order=${sortOrder}&page=${filterPage}`,
    };
  };

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
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

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3} className="text-start">
          <h3 className="left text-black">Categories</h3>
          <br />
          <ListGroup className="g-2">
            <Link to={getFilterUrl({ category: "all" })}>
              <ListGroup.Item
                action
                variant="outline-primary"
                active={"all" === category}
              >
                All Products
              </ListGroup.Item>
            </Link>
            {categories.map((c) => (
              <Link key={c} to={getFilterUrl({ category: c })}>
                <ListGroup.Item
                  action
                  variant="outline-primary"
                  active={c === category}
                >
                  {c}
                </ListGroup.Item>
              </Link>
            ))}
          </ListGroup>
          <br />
          <br />
        </Col>

        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3 text-black">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? "No" : countProducts} results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {query !== "all" || category !== "all" ? (
                      <Button
                        variant="primary"
                        className="ms-2"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fa-times-circle fas"></i>
                      </Button>
                    ) : null}
                  </div>
                  <br />
                  <br />
                </Col>
                <Col className="col-auto">
                  <Stack direction="horizontal" gap={3}>
                    Sort by{" "}
                    <Form.Select
                      value={order}
                      size="sm"
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                      className="mx-auto"
                      style={{ width: "auto" }}
                    >
                      <option value="newest">Newest Products</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                    </Form.Select>
                  </Stack>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No products found</MessageBox>
              )}

              <Row xs={1} md={3} className="g-5">
                {products.map((product) => (
                  <Col key={product._id}>
                    <Card className="d-flex flex-column h-100 text-start">
                      <Image
                        src={
                          product.image || "https://via.placeholder.com/300x200"
                        }
                        alt={product.name}
                        fluid
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "200px" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Link
                          to={`/products/${product.slug}`}
                          className="mb-2 text-decoration-none"
                        >
                          <Card.Title className="fw-bold text-truncate">
                            {product.name}
                            <span className="fw-normal text-muted category fs-6 ms-2">
                              ({product.category})
                            </span>
                          </Card.Title>
                        </Link>
                        {product.description && (
                          <Card.Text
                            className="mb-2 lh-base"
                            style={{ textAlign: "justify" }}
                          >
                            {truncateDescription(product.description)}
                          </Card.Text>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="rating">
                            Rating: {product.rating || 0}/5
                          </span>
                          <span
                            className="fw-bold text-success"
                            style={{ fontSize: "1.3rem" }}
                          >
                            {`${import.meta.env.VITE_CURRENCY} ${
                              product.price
                            }`}
                          </span>
                        </div>
                        <Button
                          variant="primary"
                          className="mt-3 w-100"
                          disabled={userInfo?.isAdmin}
                          onClick={() => addToCartHandler(product)}
                        >
                          ADD TO CART
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination className="justify-content-center my-4">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
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
        </Col>
      </Row>
    </div>
  );
}
