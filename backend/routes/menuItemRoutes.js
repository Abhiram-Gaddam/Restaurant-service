const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItemsByCategory
} = require("../controllers/menuItemController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createMenuItem);
router.get("/",    getMenuItems);
router.get("/category/:categoryId",   getMenuItemsByCategory);
router.get("/:id",   getMenuItemById);
router.put("/:id", verifyToken, isAdmin, updateMenuItem);
router.delete("/:id", verifyToken, isAdmin, deleteMenuItem);

module.exports = router;