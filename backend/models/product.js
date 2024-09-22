import mongoose, { Schema, ObjectId } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: 3,
    required: [true, "Please provide a product name (min 3 characters)."],
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Please provide a product slug."],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please provide a product description."],
  },
  brand: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    required: [true, "Please provide a valid product price."],
  },
  inStock: {
    type: Number,
    min: 0,
    required: [true, "Please provide product quantity in stock."],
  },
  category: {
    type: String,
    trim: true,
    required: [true, "Please assign a product category."],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      feedback: {
        type: String,
        trim: true,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        required: [true, "Please provide a rating (0-5) for the review."],
      },
      user: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
