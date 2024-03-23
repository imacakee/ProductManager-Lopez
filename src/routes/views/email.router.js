const { Router } = require("express");
const { sendEmailToResetPassword, resetPassword } = require("../../utils");

const router = Router();

router.post("/send-email-to-reset-password", sendEmailToResetPassword);
router.get("/reset-password/:token", resetPassword);

module.exports = router;
