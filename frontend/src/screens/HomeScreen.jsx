import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { Card, Image, Pagination, Stack } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';

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
    default:
      return state;
  }
};

const HomeScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProdcut] = useState("");
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products?page=${page}`
        );
        setProdcut(data);
      } catch (err) { }
    };
    fetchData();
  }, [page]);

  const truncateDescription = (text) => {
    if (text.length > 90) {
      // Adjust character limit based on desired line length
      return text.slice(0, 90) + "..."; // Truncate and add ellipsis
    }
    return text;
  };

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
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

  const handleSeeMore = () => {
    navigate("/products");
  }

  const createCarouselItems = () => {
    const ITEMS_PER_SLIDE = 3;
    const numberOfSlides = Math.ceil(product.length / ITEMS_PER_SLIDE);

    return Array.from({ length: numberOfSlides }).map((_, index) => (
      <Carousel.Item key={index}>
        <Row className="mb-3 text-black justify-content-center">
          {product.slice(index * ITEMS_PER_SLIDE, (index + 1) * ITEMS_PER_SLIDE).map((product) => (
            <Col md={3} key={product._id}>
              <Card
                className="flex-fill d-flex flex-column h-100 text-start"
                style={{ maxWidth: '350px' }}
              >
                <Image
                  src={product.image || "https://via.placeholder.com/300x200"}
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
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="rating">
                      Rating: {product.rating || 0}/5
                    </span>
                    <span
                      className="fw-bold text-success"
                      style={{ fontSize: "1.3rem" }}
                    >
                      {import.meta.env.VITE_CURRENCY} {product.price}
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
      </Carousel.Item>
    ));

  };


  return (
    <div className="text-black lh-base">
      <Row className="my-5 align-items-start">
        <Col className="text-start">
          <h1 className="display-5 fw-bold">Delight in <span className="text-primary">Every Bite</span> Your Event, Our <span className="text-primary">Expertise</span></h1>
          <p className="my-4"><strong>Our job is delivering a delicious food with fast, free delivering and easy.</strong></p>
          <Button className="rounded-pill" href="#products">Order Now</Button>
        </Col>
        <Col>
          <Row className="align-items-center">
            <Col lg={6} className="p-2 mb-4 mb-lg-0" style={{ height: 400 }}>
              <img
                src="https://img.freepik.com/free-photo/well-done-steak-homemade-potatoes_140725-3989.jpg?t=st=1722767960~exp=1722771560~hmac=7e7a514ae1ae734af254fad542a8c097ceb89b9d9180a5221e46e5d56e70cd00&w=740"
                className="mb-2 rounded-3 h-50"
                alt="Mountains in the Clouds"
                style={{ objectFit: "cover" }}
              />
              <img
                src="https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?t=st=1722767970~exp=1722771570~hmac=324b9bdc2bb22f532816994f68b718159dfee7f3ac02d757c15480180950f53b&w=1060"
                className="mb-2 rounded-3 h-25 shadow-1-strong"
                alt="Boat on Calm Water"
                style={{ objectFit: "cover" }}
              />
            </Col>
            <Col lg={6} className="p-2 mb-4 mb-lg-0" style={{ height: 400 }}>
              <img
                src="https://img.freepik.com/free-photo/lid-portions_1157-528.jpg?t=st=1722768241~exp=1722771841~hmac=30c9fb3e19983b1c15bf917d84a5ec59aec40642e8ab0345baac7277be3e0028&w=1060"
                className="mb-2 rounded-3 h-25 shadow-1-strong"
                alt="Waves at Sea"
                style={{ objectFit: "cover" }}
              />
              <img
                src="https://img.freepik.com/free-photo/delicious-fish-rolls-canape-with-red-caviar-served-plates_132075-13060.jpg?t=st=1722768252~exp=1722771852~hmac=8f8fb877c9078637bead2b995a26e772767191fd88c9fae66129ec5a13ab74c3&w=740"
                className="mb-2 h-50 rounded-3 shadow-1-strong"
                alt="Yosemite National Park"
                style={{ objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <h1 id="products" className="mb-4 text-center"><span className="text-primary">Meals</span> for Your Next <span className="text-primary">Event</span></h1>
      {product && <Carousel indicators={false} style={{ height: "400px" }}>
        {createCarouselItems()}
      </Carousel>}
      <Row className="mt-5 justify-content-center">
        <Col>
          <Button onClick={handleSeeMore}>See More</Button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-white bg-primary">
          <Row className="p-4 text-start align-items-center">
            <Col>
              <Image src="https://static.wixstatic.com/media/11062b_d795307e27fa4ffcb88b120e7a9fd090~mv2.jpeg/v1/fill/w_281,h_429,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Wine%20%26%20Dine.jpeg" fluid />
            </Col>
            <Col>
              <h2 className="mb-4">Dining Services</h2>
              <ul>
                <li className="mb-3">Enjoy a variety of culinary delights.</li>
                <li className="mb-3">Your dining pleasure is our top priority.</li>
                <li className="mb-3">Let us create a memorable dining experience.</li>
              </ul>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="p-4 text-start align-items-center">
            <Col>
              <Image src="https://static.wixstatic.com/media/11062b_cc718cb2696e41cc8e76a4715c50cf7f~mv2.jpg/v1/fill/w_281,h_429,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Stoocked%20Buffet.jpg" fluid />
            </Col>
            <Col>
              <h2 className="mb-4">Wedding Events</h2>
              <ul>
                <li className="mb-3">Create a wedding as unique as your love story.</li>
                <li className="mb-3">Your special day, perfectly planned.</li>
                <li className="mb-3">Expertly crafted to your vision, down to the last detail.</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Row className="p-4 text-start align-items-center">
            <Col>
              <Image src="https://static.wixstatic.com/media/nsplsh_d9b0cd574c044ca9ad8a1ae7469a98d7~mv2.jpg/v1/fill/w_281,h_429,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Image%20by%20Aneta%20Pawlik.jpg" fluid />
            </Col>
            <Col>
              <h2 className="mb-4">Catering Services</h2>
              <ul>
                <li className="mb-3">Enrich your event with our exquisite cuisine.</li>
                <li className="mb-3">Personalized service, exceptional results.</li>
                <li className="mb-3">Catering solutions for any size or style.</li>
              </ul>
            </Col>
          </Row>
        </Col>
        <Col className="text-white bg-primary">
          <Row className="p-4 text-start align-items-center">
            <Col>
              <Image src="https://static.wixstatic.com/media/nsplsh_77f8b657b9c04b12b005f9c31bf5faec~mv2.jpg/v1/fill/w_281,h_429,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Image%20by%20Farhad%20Ibrahimzade.jpg" fluid />
            </Col>
            <Col>
              <h2 className="mb-4">Corporate Events</h2>
              <ul>
                <li className="mb-3">Uplift your corporate events with our exceptional catering.</li>
                <li className="mb-3">Seamless service from start to finish.</li>
                <li className="mb-3">A catering partner you can trust.</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    </div >
  );
};

export default HomeScreen;
