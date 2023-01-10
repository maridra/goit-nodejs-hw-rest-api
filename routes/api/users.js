const express = require("express");
const { validateAuth, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/users");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateAuth(schemas.authSchema), ctrl.register);

router.get("/login", validateAuth(schemas.authSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/", authenticate, ctrl.updateSubscription);

module.exports = router;
