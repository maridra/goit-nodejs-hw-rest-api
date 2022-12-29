const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");
const { validateBody, validateMessages } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post(
  "/",
  validateBody(schemas.addSchema, validateMessages.add),
  ctrl.addContact
);

router.put(
  "/:contactId",
  validateBody(schemas.addSchema, validateMessages.update),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.updateFavoriteSchema, validateMessages.updateFavorite),
  ctrl.updateFavorite
);

router.delete("/:contactId", ctrl.deleteById);

module.exports = router;
