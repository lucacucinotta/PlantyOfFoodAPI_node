const express = require("express");
const {
  postOrder,
  putOrder,
  deleteOrder,
  getOrder,
  getOrders,
} = require("../controller/order/orderController");

const router = express.Router();

router.post("/order", postOrder);
router.put("/order/:id", putOrder);
router.delete("/order/:id", deleteOrder);
router.get("/order/:id", getOrder);
router.get("/orders", getOrders);

module.exports = router;
