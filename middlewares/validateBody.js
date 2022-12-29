const { HttpError } = require("../helpers");

const validateMessages = {
  add: "Missing required name field",
  update: "Missing fields",
  updateFavorite: "Missing field favorite",
};

const validateBody = (schema, message = validateMessages.update) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, message));
    }
    next();
  };

  return func;
};

module.exports = { validateBody, validateMessages };
