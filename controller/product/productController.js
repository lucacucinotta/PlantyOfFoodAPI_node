const { Product, productJoiSchema } = require("../../models/productSchema");
const {
  validateRequestFunction,
  handleError,
  isIDValid,
  isProductExists,
} = require("./utils");

const postProduct = async (req, res) => {
  try {
    const reqValidationFailed = validateRequestFunction(
      productJoiSchema,
      req,
      res
    );
    if (reqValidationFailed) return;
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    handleError(res, err);
  }
};

const putProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;
    const reqValidationFailed = validateRequestFunction(
      productJoiSchema,
      req,
      res
    );
    if (reqValidationFailed) return;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const productError = isProductExists(res, product, id);
    if (productError) return;
    res.status(200).json(product);
  } catch (err) {
    handleError(res, err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;
    const product = await Product.findByIdAndDelete(id);
    const productError = isProductExists(res, product, id);
    if (productError) return;
    res.status(200).json(product);
  } catch (err) {
    handleError(res, err);
  }
};

const getProducts = async (req, res) => {
  try {
    if (req.params.id) {
      const idValidationFailed = isIDValid(req.params.id, res);
      if (idValidationFailed) return;
      const product = await Product.findById(req.params.id);
      const productError = isProductExists(res, product, req.params.id);
      if (productError) return;
      return res.status(200).json(product);
    }
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ message: "There isn't any product." });
    }
    res.status(200).json(products);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postProduct, putProduct, deleteProduct, getProducts };
