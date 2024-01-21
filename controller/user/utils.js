const validateRequestFunction = (joiSchema, req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errorMessage: error.details[0].message });
  }
  return;
};

const handleError = (res, err) => {
  if (err.code === 11000) {
    return res
      .status(409)
      .json({
        errorMessage: "This email is already registered. Please retry.",
      });
  }
  console.error(err);
  res.status(500).json({ errorMessage: err.message });
};

const isIDValid = (id, res) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res
      .status(400)
      .json({ errorMessage: `Invalid format for the user's ID: ${id}.` });
  }
  return;
};

const isEmailExists = (res, product, id) => {
  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: `Cannot find any user with this id : ${id}` });
  }
  return;
};

module.exports = {
  validateRequestFunction,
  handleError,
  isIDValid,
  isEmailExists,
};
