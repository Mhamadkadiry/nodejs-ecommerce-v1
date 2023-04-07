const mongoose = require("mongoose");

// Schema creation
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand's name is required"],
      unique: [true, "Brand's name is used before"],
      minlength: [2, "Brand's name is too short"],
      maxlength: [32, "Brand's name is too long"],
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
const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;
