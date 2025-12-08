const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createCategory);
router.get("/", verifyToken, getCategories);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

module.exports = router;
