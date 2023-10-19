const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const calculateCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  return totalPrice;
};

//   @desc Add product to cart
//   @route POST /api/v1/cart
//   @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // 1) get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    //creat cart for logged user
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    //product exist
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // push product if it doesn't already exist to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  const totalPrice = calculateCartPrice(cart);

  cart.totalCartPrice = totalPrice;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully!",
    data: cart,
  });
});

//   @desc get Logget user cart to cart
//   @route GET /api/v1/cart
//   @access Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("There is no cart for this user!", 404));
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//   @desc Remove specific cart item
//   @route GET /api/v1/cart/:itemId
//   @access Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError("There is no cart for this user!", 404));
  }
  calculateCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//   @desc Remove specific cart item
//   @route GET /api/v1/cart/:itemId
//   @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//   @desc Update specific cart item quantity
//   @route GET /api/v1/cart/:itemId
//   @access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no cart for this user!", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("Item doesn't exists!", 404));
  }
  calculateCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//   @desc Apply coupon on logged user cart
//   @route GET /api/v1/cart/applycoupon
//   @access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // Get coupon and validate it
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired!"));
  }

  // Get total cart price of logged user
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = calculateCartPrice(cart);

  //calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
