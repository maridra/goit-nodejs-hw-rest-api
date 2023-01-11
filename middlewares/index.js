const { validateBody, validateMessages } = require("./validateBody");
const { validateAuth } = require("./validateAuth");
const authenticate = require("./authenticate");
const isValidId = require("./isValidId");

module.exports = {
  validateBody,
  validateMessages,
  validateAuth,
  authenticate,
  isValidId,
};
