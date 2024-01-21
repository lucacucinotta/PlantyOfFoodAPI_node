const express = require("express");
const {
  postProduct,
  putProduct,
  deleteProduct,
  getProducts,
} = require("../controller/product/productController");

const router = express.Router();

router.post("/product", postProduct);
router.put("/product/:id", putProduct);
router.delete("/product/:id", deleteProduct);
router.get("/products/:id?", getProducts);

module.exports = router;
