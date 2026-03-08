const express = require("express");
const router = express.Router();
const {
  createTable,
  getTables,
  updateTable,
  deleteTable,
  getAvailableTables,
  getTableById,
  resetTables
} = require("../controllers/tableController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
router.post("/reset", verifyToken,isAdmin, resetTables);
router.post("/", verifyToken, isAdmin, createTable);
router.get("/available",   getAvailableTables);
router.get("/",  getTables);
router.get("/:id",  getTableById);
router.put("/:id", verifyToken, isAdmin, updateTable);
router.delete("/:id", verifyToken, isAdmin, deleteTable);

module.exports = router;