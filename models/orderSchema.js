const mongoose = require("mongoose");
const Joi = require("joi");
const { defaultDate } = require("./utils");

const orderMongooseSchema = mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    date: {
      type: String,
      default: defaultDate,
    },
  },
  {
    versionKey: "versionKey",
  }
);

const Order = mongoose.model("Order", orderMongooseSchema);

const orderJoiSchemaPOST = Joi.object({
  products: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.string()
        .empty()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.base": "Product ID must be a string.",
          "string.empty": "Product ID cannot be an empty string.",
          "string.pattern.base":
            "Invalid format for the product's ID: '{{#value}}'.",
        })
    )
    .messages({
      "any.required": "Path 'products' is required.",
      "array.base": "Path 'products' must be an array.",
      "array.min": "Path 'products' must contain at least one element.",
    }),
  users: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.string()
        .empty()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.base": "User ID must be a string.",
          "string.empty": "User ID cannot be an empty string.",
          "string.pattern.base":
            "Invalid format for the user's ID: '{{#value}}'.",
        })
    )
    .messages({
      "any.required": "Path 'users' is required.",
      "array.base": "Path 'users' must be an array.",
      "array.min": "Path 'users' must contain at least one element.",
    }),
  date: Joi.string()
    .empty()
    .regex(/^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))$/)
    .messages({
      "string.base": "Date must be a string.",
      "string.empty": "Date cannot be an empty string.",
      "string.pattern.base": "Date must be in the format YYYY-MM-DD.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "Path not allowed: {{#key}}. Please remove it.",
  });

const orderJoiSchemaPUT = Joi.object({
  products: Joi.array()
    .min(1)
    .items(
      Joi.string()
        .empty()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.base": "Product ID must be a string.",
          "string.empty": "Product ID cannot be an empty string.",
          "string.pattern.base":
            "Invalid format for the product's ID: '{{#value}}'.",
        })
    )
    .messages({
      "any.required": "Path 'products' is required.",
      "array.base": "Path 'products' must be an array.",
      "array.min": "Path 'products' must contain at least one element.",
    }),
  users: Joi.array()
    .min(1)
    .items(
      Joi.string()
        .empty()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.base": "User ID must be a string.",
          "string.empty": "User ID cannot be an empty string.",
          "string.pattern.base":
            "Invalid format for the user's ID: '{{#value}}'.",
        })
    )
    .messages({
      "any.required": "Path 'users' is required.",
      "array.base": "Path 'users' must be an array.",
      "array.min": "Path 'users' must contain at least one element.",
    }),
  date: Joi.string()
    .empty()
    .regex(/^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))$/)
    .messages({
      "string.base": "Date must be a string.",
      "string.empty": "Date cannot be an empty string.",
      "string.pattern.base": "Date must be in the format YYYY-MM-DD.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "Path not allowed: {{#key}}. Please remove it.",
  });

module.exports = { Order, orderJoiSchemaPOST, orderJoiSchemaPUT };
