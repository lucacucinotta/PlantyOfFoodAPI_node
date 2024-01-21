const mongoose = require("mongoose");
const Joi = require("joi");
const capitalizedFirstLetter = require("./utils");

const userMongooseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      set: capitalizedFirstLetter,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      set: capitalizedFirstLetter,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
  },
  {
    versionKey: "versionKey",
  }
);

const User = mongoose.model("User", userMongooseSchema);

const userJoiSchemaPOST = Joi.object({
  name: Joi.string()
    .empty()
    .required()
    .regex(/^.{2,25}$/)
    .messages({
      "string.base": "User's name must be a string.",
      "string.empty": "User's name cannot be an empty string.",
      "any.required": "Path 'name' is required.",
      "string.pattern.base":
        "Invalid format for user's name. Length must be between 2 and 25 characters.",
    }),
  lastName: Joi.string()
    .empty()
    .required()
    .regex(/^.{2,25}$/)
    .messages({
      "string.base": "User's last name must be a string.",
      "string.empty": "User's last name cannot be an empty string.",
      "any.required": "Path 'lastName' is required.",
      "string.pattern.base":
        "Invalid format for user's last name. Length must be between 2 and 25 characters.",
    }),
  email: Joi.string()
    .empty()
    .required()
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .messages({
      "string.base": "User's email must be a string.",
      "string.empty": "User's email cannot be an empty string.",
      "any.required": "Path 'email' is required.",
      "string.pattern.base": "Please enter a valid email.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "Path not allowed: {{#key}}. Please remove it.",
  });

const userJoiSchemaPUT = Joi.object({
  name: Joi.string()
    .empty()
    .regex(/^.{2,25}$/)
    .messages({
      "string.base": "User's name must be a string.",
      "string.empty": "User's name cannot be an empty string.",
      "string.pattern.base":
        "Invalid format for user's name. Length must be between 2 and 25 characters.",
    }),
  lastName: Joi.string()
    .empty()
    .regex(/^.{2,25}$/)
    .messages({
      "string.base": "User's last name must be a string.",
      "string.empty": "User's last name cannot be an empty string.",
      "string.pattern.base":
        "Invalid format for user's last name. Length must be between 2 and 25 characters.",
    }),
  email: Joi.string()
    .empty()
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .messages({
      "string.base": "User's email must be a string.",
      "string.empty": "User's email cannot be an empty string.",
      "string.pattern.base": "Please enter a valid email.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "Path not allowed: {{#key}}. Please remove it.",
  });

module.exports = { User, userJoiSchemaPOST, userJoiSchemaPUT };
