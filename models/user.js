const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { HandleMongooseError } = require("../helpers");

const subscriptions = ["starter", "pro", "business"];
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptions,
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", HandleMongooseError);

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptions),
});

const schemas = {
  authSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
