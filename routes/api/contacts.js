const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  validateMessages,
  authenticate,
  isValidId,
} = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", isValidId, authenticate, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema, validateMessages.add),
  ctrl.addContact
);

router.put(
  "/:contactId",
  isValidId,
  authenticate,
  validateBody(schemas.addSchema, validateMessages.update),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  authenticate,
  validateBody(schemas.updateFavoriteSchema, validateMessages.updateFavorite),
  ctrl.updateFavorite
);

router.delete("/:contactId", isValidId, authenticate, ctrl.deleteById);

module.exports = router;
