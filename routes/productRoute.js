const express = require("express");
const {
  postProduct,
  putProduct,
  deleteProduct,
  getProducts,
} = require("../controller/product/productController");

const router = express.Router();

router.post("/products", postProduct);
router.put("/products/:id", putProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/:id?", getProducts);

module.exports = router;
