const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const SUPPLIERS = [
  { id: 1, name: "Kisan Agro Centre", distanceKm: 1.2, item: "Neem oil, fungicides in stock" },
  { id: 2, name: "Bharat Beej Bhandar", distanceKm: 2.8, item: "Rust-resistant wheat seed" },
];

const EXPERTS = [
  { id: 1, name: "Dr. Anita Verma", role: "Plant Pathologist, KVK Kanpur", availability: "Available today", phone: "9000000001" },
  { id: 2, name: "Suresh Yadav", role: "Agronomist, District Office", availability: "Available tomorrow", phone: "9000000002" },
];

router.get("/suppliers", requireAuth, (req, res) => res.json(SUPPLIERS));
router.get("/experts", requireAuth, (req, res) => res.json(EXPERTS));

module.exports = router;
