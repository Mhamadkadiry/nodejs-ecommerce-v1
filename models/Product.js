const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title!"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      minlength: [20, "Too short product description!"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required!"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      maxlength: [20, "Too long product price!"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Image cover is required!"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product must belong to a specific category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1!"],
      max: [5, "Rating must be below or equal to 5!"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
