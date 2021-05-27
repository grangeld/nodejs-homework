const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users.js"); // контроллер
const guard = require("../../../helpers/guard");

router.post("/signup", ctrl.reg);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
