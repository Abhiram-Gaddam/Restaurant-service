const express = require("express");
const router = express.Router();
const { getDashboardMetrics } = require("../controllers/analyticsController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, isAdmin, getDashboardMetrics);

module.exports = router;