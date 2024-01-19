const express = require("express");
const {
  postProduct,
  putProduct,
  deleteProduct,
  getProduct,
} = require("../controller/productController");

const router = express.Router();

router.post("/product", postProduct);
router.put("/product/:id", putProduct);
router.delete("/product/:id", deleteProduct);
router.get("/products/:id?", getProduct);

module.exports = router;
