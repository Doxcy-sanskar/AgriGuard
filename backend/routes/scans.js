const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname) || ".jpg"}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Unsupported file type"), ok);
  },
});

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// POST /api/scans  — upload a leaf image, get a REAL diagnosis from the ML service
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded (field name: image)" });

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 15000,
    });

    const diagnosis = mlResponse.data;

    const scan = db.insert("scans", {
      id: uuidv4(),
      userId: req.user.id,
      fieldLabel: req.body.fieldLabel || "Unlabeled field",
      imageFile: req.file.filename,
      status: diagnosis.status,
      label: diagnosis.label,
      confidence: diagnosis.confidence,
      affectedPct: diagnosis.affected_pct,
      details: diagnosis.details,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(scan);
  } catch (err) {
    console.error("ML service call failed:", err.message);
    res.status(502).json({
      error: "Could not reach ML analysis service. Is it running on " + ML_SERVICE_URL + "?",
      detail: err.message,
    });
  }
});

// GET /api/scans — this user's scan history (the "field ledger")
router.get("/", requireAuth, (req, res) => {
  const scans = db
    .findAll("scans", (s) => s.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(scans);
});

// GET /api/scans/:id/image — serve the uploaded image back
router.get("/:id/image", requireAuth, (req, res) => {
  const scan = db.findOne("scans", (s) => s.id === req.params.id && s.userId === req.user.id);
  if (!scan) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(UPLOAD_DIR, scan.imageFile));
});

module.exports = router;
