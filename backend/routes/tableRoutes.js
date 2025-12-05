const express = require("express");
const router = express.Router();
const {
  createTable,
  getTables,
  updateTable,
  deleteTable
} = require("../controllers/tableController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, createTable);
router.get("/", verifyToken, getTables);
router.put("/:id", verifyToken, isAdmin, updateTable);
router.delete("/:id", verifyToken, isAdmin, deleteTable);

module.exports = router;
