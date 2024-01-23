const mongoose = require("mongoose");
const Joi = require("joi");
const { capitalizedFirstLetter } = require("./utils");

const productMongooseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      set: capitalizedFirstLetter,
    },
  },
  {
    versionKey: "versionKey",
  }
);

const Product = mongoose.model("Product", productMongooseSchema);

const productJoiSchema = Joi.object({
  name: Joi.string().required().empty().trim().messages({
    "string.base": "Product's name must be a string.",
    "any.required": "Path 'name' is required.",
    "string.empty": "Product's name cannot be an empty string.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "Path not allowed: {{#key}}. Please remove it.",
  });

module.exports = { Product, productJoiSchema };
