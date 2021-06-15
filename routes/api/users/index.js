const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users"); // контроллер
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", ctrl.repeatSendEmailVerify);
router.post("/signup", ctrl.reg);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.patch("/avatars", [guard, upload.single("avatar")], ctrl.avatars);

module.exports = router;
