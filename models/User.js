const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
    },
    phone: { type: String },
    profileImg: { type: String },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password is too short!"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setImageURL = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};
// find, findAll, and update
userSchema.post("init", (doc) => {
  setImageURL(doc);
});
// create
userSchema.post("save", (doc) => {
  setImageURL(doc);
  console.log(doc);
});

module.exports = mongoose.model("User", userSchema);