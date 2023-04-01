const mongoose = require("mongoose");

// Schema creation
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category's name is required"],
      unique: [true, "Category's name is used before"],
      minlength: [3, "Category's name is too short"],
      maxlength: [32, "Category's name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
// Model creation
const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
