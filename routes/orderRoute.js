const express = require("express");

const authService = require("../services/authService");
const {
  createCashOrder,
  getAllOrders,
  findSpecificOrder,
  filterOrdersForLoggedUsers,
  orderPayed,
  orderDelivered,
  checkoutSession,
} = require("../services/orderService");

const router = express.Router();

router.use(authService.protect);
router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);
router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrdersForLoggedUsers,
  getAllOrders
);
router.get(
  "/:id",
  authService.allowedTo("user", "admin", "manager"),
  findSpecificOrder
);
router.put("/:id/pay", authService.allowedTo("admin", "manager"), orderPayed);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  orderDelivered
);

module.exports = router;
