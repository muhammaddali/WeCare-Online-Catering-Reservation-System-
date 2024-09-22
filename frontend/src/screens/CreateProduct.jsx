import React, { useContext, useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { Button, Form } from "react-bootstrap";

function CreateProduct({ onProductCreate }) {
  const [image, setImage] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Retrieve user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  }, []);

  const initialValues = {
    name: "",
    price: "",
    brand: "",
    inStock: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(100, "Name must be at most 100 characters"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
    brand: Yup.string()
      .required("Brand is required")
      .max(100, "Brand must be at most 100 characters"),
    inStock: Yup.number()
      .required("Count in Stock is required")
      .min(0, "Count in Stock must be at least 0"),
    description: Yup.string()
      .required("Description is required")
      .max(2000, "Description must be at most 2000 characters"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const cloudinaryData = await uploadImage();
      const imageUrl = cloudinaryData.url;
      // const imageUrl = "";

      const newProduct = {
        name: values.name.trim(),
        price: values.price,
        brand: values.brand.trim(),
        category: values.category.trim(),
        inStock: values.inStock,
        description: values.description.trim(),
        image: imageUrl,
        userDetails: userDetails,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.status === 201) {
        toast.success("Product created successfully");
        resetForm();
        onProductCreate?.();
      } else {
        const data = await response.json();
        console.log(data.error);
        toast.error("Error creating product");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || error.message);
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "we_care");
    data.append("cloud_name", "dqugdc5ae");

    try {
      if (image === null) {
        throw new Error("Please upload an image");
      }

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dqugdc5ae/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();
      return cloudData;
    } catch (error) {
      throw new Error("Error uploading image:", error);
    }
  };

  return (
    <div className="add-item">
      <div className="post1">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue }) => (
            <FormikForm as={Form}>
              <Form.Group controlId="name">
                <Form.Label className="text-black">Name:</Form.Label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter name..."
                  as={Form.Control}
                  required
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="price" className="mt-4">
                <Form.Label className="text-black">Price:</Form.Label>
                <Field
                  type="number"
                  name="price"
                  placeholder="Enter price..."
                  as={Form.Control}
                  required
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="brand" className="mt-4">
                <Form.Label className="text-black">Brand:</Form.Label>
                <Field
                  type="text"
                  name="brand"
                  placeholder="Enter brand..."
                  as={Form.Control}
                  required
                />
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="category" className="mt-4">
                <Form.Label className="text-black">Category:</Form.Label>
                <Field
                  type="text"
                  name="category"
                  placeholder="Enter category..."
                  as={Form.Control}
                  required
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="inStock" className="mt-4">
                <Form.Label className="text-black">Count in Stock:</Form.Label>
                <Field
                  type="number"
                  name="inStock"
                  placeholder="Enter count in stock..."
                  as={Form.Control}
                  required
                />
                <ErrorMessage
                  name="inStock"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="description" className="mt-4">
                <Form.Label className="text-black">Description:</Form.Label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter description..."
                  className="form-control"
                  required
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group controlId="imageUpload" className="mt-4">
                <Form.Label className="text-black">Upload Image:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setFieldValue("image", e.target.files[0]);
                  }}
                />
              </Form.Group>

              <Button variant="primary" className="mt-4" type="submit">
                Create Product
              </Button>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateProduct;
