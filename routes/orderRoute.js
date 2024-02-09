const express = require("express");
const {
  postOrder,
  putOrder,
  deleteOrder,
  getOrder,
  getOrders,
} = require("../controller/order/orderController");

const router = express.Router();

router.post("/orders", postOrder);
router.put("/orders/:id", putOrder);
router.delete("/orders/:id", deleteOrder);
router.get("/orders/:id", getOrder);
router.get("/orders", getOrders);

module.exports = router;
