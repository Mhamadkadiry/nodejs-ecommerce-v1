const stripe = require("stripe");
const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc create cash order
// @route POST /api/v1/orders/:cartId
// @access Private/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depending on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart does not exist!", 404));
  }
  // 2) get order price, check coupon
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create order with default paymentmethod type
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) decrement product quantity and increment product sales
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrdersForLoggedUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObj = { user: req.user._id };
  next();
});
// @desc create get all orders
// @route POST /api/v1/orders
// @access Private/User-Admin-Manager
exports.getAllOrders = factory.getAll(Order);

// @desc create get specific order
// @route POST /api/v1/orders/:orderId
// @access Private/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc update order paid status to paid
// @route POST /api/v1/orders/:id/pay
// @access Private/Admin-Manager
exports.orderPayed = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order doesn't exists!", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc update order delivered status to delivered
// @route POST /api/v1/orders/:id/deliver
// @access Private/Admin-Manager
exports.orderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order doesn't exists!", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc Get cehckout session from stripe and send it as a response
// @route POST /api/v1/orders/:id/checkout-session/:cartId
// @access Private/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const stripeClient = stripe(process.env.STRIPE_SECRET);
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart does not exist!", 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const session = await stripeClient.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
            description: "To pay",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const stripeClient = stripe(process.env.STRIPE_SECRET);

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }

  res.status(200).json({ status: true });
});
