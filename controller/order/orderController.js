const {
  Order,
  orderJoiSchemaPOST,
  orderJoiSchemaPUT,
} = require("../../models/orderSchema");
const {
  validateRequestFunction,
  isIDValid,
  isOrderExists,
  isIdExists,
} = require("./utils");
const { Product } = require("../../models/productSchema");
const { User } = require("../../models/userSchema");

const postOrder = async (req, res) => {
  try {
    const reqValidationFailed = validateRequestFunction(
      orderJoiSchemaPOST,
      req,
      res
    );
    if (reqValidationFailed) return;
    const idProductsError = await isIdExists(Product, req.body.products, res);
    if (idProductsError) return;
    const idUsersError = await isIdExists(User, req.body.users, res);
    if (idUsersError) return;

    const order = await Order.create(req.body);
    const populateOrder = await Order.findById(order._id).populate(
      "products users"
    );
    res.status(201).json(populateOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errorMessage: err.message });
  }
};

const putOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;
    const validationError = validateRequestFunction(
      orderJoiSchemaPUT,
      req,
      res
    );
    if (validationError) return;
    if (req.body.products) {
      const idProductsError = await isIdExists(Product, req.body.products, res);
      if (idProductsError) return;
    }
    if (req.body.users) {
      const idUsersError = await isIdExists(User, req.body.users, res);
      if (idUsersError) return;
    }

    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    const orderError = isOrderExists(res, order, id);
    if (orderError) return;

    const populateOrder = await Order.findById(order._id).populate(
      "products users "
    );
    res.status(200).json(populateOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;

    const order = await Order.findById(id).populate("products users");
    const orderError = isOrderExists(res, order, id);
    if (orderError) return;
    await Order.deleteOne(order);

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;

    const order = await Order.findById(id).populate("products users");
    const orderError = isOrderExists(res, order, id);
    if (orderError) return;

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { date, product, user } = req.query;

    const query = {};

    if (date) {
      if (
        /^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))$/.test(date)
      ) {
        query.date = date;
      } else {
        return res.status(400).json({
          errorMessage:
            "Invalid date in query. Date must be in the format YYYY-MM-DD.",
        });
      }
    }
    if (product) {
      if (/^[0-9a-fA-F]{24}$/.test(product)) {
        query.products = product;
      } else {
        return res
          .status(400)
          .json({ errorMessage: "Invalid product ID in query." });
      }
    }
    if (user) {
      if (/^[0-9a-fA-F]{24}$/.test(user)) {
        query.users = user;
      } else {
        return res
          .status(400)
          .json({ errorMessage: "Invalid user ID in query." });
      }
    }

    const orders = await Order.find(query).populate("products users");

    if (orders.length === 0) {
      return res.status(404).json({ errorMessage: "There isn't any order." });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err.message });
  }
};
module.exports = { postOrder, putOrder, deleteOrder, getOrder, getOrders };
