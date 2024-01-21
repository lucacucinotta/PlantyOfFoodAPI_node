const {
  User,
  userJoiSchemaPOST,
  userJoiSchemaPUT,
} = require("../../models/userSchema");
const {
  validateRequestFunction,
  handleError,
  isIDValid,
  isEmailExists,
} = require("./utils");

const postUser = async (req, res) => {
  try {
    const reqValidationFailed = validateRequestFunction(
      userJoiSchemaPOST,
      req,
      res
    );
    if (reqValidationFailed) return;
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

const putUser = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;
    const reqValidationFailed = validateRequestFunction(
      userJoiSchemaPUT,
      req,
      res
    );
    if (reqValidationFailed) return;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const userError = isEmailExists(res, user, id);
    if (userError) return;
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationFailed = isIDValid(id, res);
    if (idValidationFailed) return;
    const user = await User.findByIdAndDelete(id);
    const userError = isEmailExists(res, user, id);
    if (userError) return;
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.params.id) {
      const idValidationFailed = isIDValid(req.params.id, res);
      if (idValidationFailed) return;
      const user = await User.findById(req.params.id);
      const userError = isEmailExists(res, user, req.params.id);
      if (userError) return;
      return res.status(200).json(user);
    }
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "There isn't any user." });
    }
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { postUser, putUser, deleteUser, getUsers };
