const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const otpStore = require("../otpStore");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone, name: user.name },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "30d" }
  );
}

function publicUser(u) {
  return { id: u.id, name: u.name, phone: u.phone, village: u.village, crops: u.crops };
}

// Step 1: request an OTP. Works for both login and register — if the
// phone isn't registered yet, register info must be supplied.
router.post("/send-otp", (req, res) => {
  const { phone, name, village, crops } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "A valid 10-digit phone number is required" });
  }

  let user = db.findOne("users", (u) => u.phone === phone);

  if (!user) {
    if (!name || !village) {
      return res.status(400).json({ error: "New number — name and village are required to register" });
    }
    user = db.insert("users", {
      id: uuidv4(),
      phone,
      name,
      village,
      crops: Array.isArray(crops) && crops.length ? crops : ["Wheat"],
      createdAt: new Date().toISOString(),
    });
  }

  const demoCode = otpStore.generateAndSend(phone);

  res.json({
    message: "OTP sent",
    // demoCode is only ever returned because there's no real SMS gateway
    // wired up yet — remove this field once you connect Twilio/MSG91.
    demoCode,
  });
});

// Step 2: verify OTP, issue JWT
router.post("/verify-otp", (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "phone and code are required" });
  }

  const ok = otpStore.verify(phone, code);
  if (!ok) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  const user = db.findOne("users", (u) => u.phone === phone);
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

module.exports = router;
