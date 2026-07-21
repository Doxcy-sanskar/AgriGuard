const express = require("express");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const ADVISORY_LIBRARY = {
  healthy: {
    organic: [{ title: "Maintain balanced compost feeding", detail: "Continue routine organic feeding every 2-3 weeks to sustain plant vigor." }],
    chemical: [{ title: "No chemical action needed", detail: "Crop shows no disease signs — avoid unnecessary spraying." }],
    preventive: [
      { title: "Continue monitoring", detail: "Re-scan every 5-7 days, especially after rain or humidity spikes." },
      { title: "Maintain field spacing", detail: "Good airflow between plants reduces future fungal risk." },
    ],
  },
  warning: {
    organic: [
      { title: "Neem oil spray", detail: "Mix 30ml neem oil per litre of water. Apply at dusk every 5-7 days." },
      { title: "Baking soda solution", detail: "1 tsp baking soda + a few drops of liquid soap in 1L water, weekly." },
    ],
    chemical: [{ title: "Hold off on chemical spray", detail: "Symptoms are early-stage — reassess in 3-4 days before using fungicide." }],
    preventive: [
      { title: "Remove affected leaves", detail: "Prune and dispose of visibly stressed leaves to limit spread." },
      { title: "Reduce leaf wetness", detail: "Avoid overhead irrigation in the evening; water at the base." },
    ],
  },
  diseased: {
    organic: [{ title: "Neem oil + copper spray combo", detail: "Alternate neem oil and a copper-based organic fungicide every 5 days." }],
    chemical: [
      { title: "Propiconazole 25% EC", detail: "1ml per litre of water, spray at first sign of rust pustules." },
      { title: "Confirm local dosage limits", detail: "Verify exact dosage with your nearest Krishi Vigyan Kendra before applying." },
    ],
    preventive: [
      { title: "Isolate affected zone", detail: "Avoid working from the diseased area to healthy areas to prevent spread on tools/hands." },
      { title: "Resistant varieties next season", detail: "Consider rust-resistant seed varieties for the next sowing cycle." },
      { title: "Crop rotation", detail: "Avoid planting the same crop in this field consecutively." },
    ],
  },
};

// GET /api/advisory?status=healthy|warning|diseased
router.get("/", requireAuth, (req, res) => {
  const status = ["healthy", "warning", "diseased"].includes(req.query.status) ? req.query.status : "warning";
  res.json({ status, advisory: ADVISORY_LIBRARY[status] });
});

module.exports = router;
