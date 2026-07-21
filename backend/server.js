require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scans");
const advisoryRoutes = require("./routes/advisory");
const alertRoutes = require("./routes/alerts");
const marketRoutes = require("./routes/market");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "agriguard-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/market", marketRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`AgriGuard backend running on http://localhost:${PORT}`);
  console.log(`ML service expected at ${process.env.ML_SERVICE_URL || "http://localhost:8000"}`);
});
