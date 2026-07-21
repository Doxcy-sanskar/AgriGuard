const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/alerts — generated from the user's real scan history, not hardcoded
router.get("/", requireAuth, (req, res) => {
  const scans = db
    .findAll("scans", (s) => s.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const alerts = [];

  const latest = scans[0];
  if (latest && latest.status === "diseased") {
    alerts.push({
      id: `alert-${latest.id}`,
      level: "high",
      title: `Disease detected: ${latest.label}`,
      body: `Your latest scan of "${latest.fieldLabel}" shows ${latest.affectedPct}% affected leaf area. Review the advisory tab for recommended action.`,
      time: latest.createdAt,
    });
  } else if (latest && latest.status === "warning") {
    alerts.push({
      id: `alert-${latest.id}`,
      level: "medium",
      title: `Early signs: ${latest.label}`,
      body: `Your latest scan of "${latest.fieldLabel}" shows early symptoms. Re-scan in a few days to track progression.`,
      time: latest.createdAt,
    });
  }

  const daysSinceLastScan = latest
    ? (Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  if (daysSinceLastScan > 5) {
    alerts.push({
      id: "alert-followup",
      level: "low",
      title: "Scan follow-up due",
      body: latest
        ? `It has been over ${Math.floor(daysSinceLastScan)} days since your last scan.`
        : "You haven't scanned any leaves yet — try it from the Scan tab.",
      time: new Date().toISOString(),
    });
  }

  res.json(alerts);
});

module.exports = router;
