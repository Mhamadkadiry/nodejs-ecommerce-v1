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

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// find, findAll, and update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});
// Model creation
const Category = mongoose.model("category", categorySchema);

module.exports = Category;
