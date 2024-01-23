const validateRequestFunction = (joiSchema, req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errorMessage: error.details[0].message });
  }
  return;
};

const isIDValid = (id, res) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res
      .status(400)
      .json({ errorMessage: `Invalid format for the order's ID: ${id}.` });
  }
  return;
};

const isOrderExists = (res, order, id) => {
  if (!order) {
    return res
      .status(404)
      .json({ errorMessage: `Cannot find any order with this id : ${id}` });
  }
  return;
};

const isIdExists = async (model, ids, res) => {
  for (const id of ids) {
    const existsInDatabase = await model.exists({ _id: id });
    if (!existsInDatabase) {
      return res.status(400).json({
        errorMessage: `${model.modelName}'s ID ${id} doesn't exists.`,
      });
    }
  }
  return;
};

module.exports = {
  validateRequestFunction,
  isIDValid,
  isOrderExists,
  isIdExists,
};
