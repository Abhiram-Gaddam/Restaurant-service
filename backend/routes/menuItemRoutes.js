const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuItemController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createMenuItem);
router.get("/", verifyToken, getMenuItems);
router.put("/:id", verifyToken, isAdmin, updateMenuItem);
router.delete("/:id", verifyToken, isAdmin, deleteMenuItem);

module.exports = router;
