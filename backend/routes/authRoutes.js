const express = require("express");
const router = express.Router();
const { register, login, getMe, resetPassword, getAllUsers } = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/reset-password", verifyToken, resetPassword);
router.get("/users", verifyToken, isAdmin, getAllUsers);

module.exports = router;