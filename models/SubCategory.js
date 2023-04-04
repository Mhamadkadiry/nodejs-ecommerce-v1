const mongoose = require("mongoose");

// Schema creation
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory's name is required"],
      unique: [true, "SubCategory's name is used before"],
      minlength: [2, "SubCategory's name is too short"],
      maxlength: [32, "SubCategory's name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to a specific category!"],
    },
  },
  { timestamps: true }
);
// Model creation
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;
