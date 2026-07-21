/**
 * otpStore.js — in-memory OTP store for the demo phone-login flow.
 *
 * In production, replace generateAndSend() with a real SMS gateway call
 * (e.g. MSG91, Twilio) and store OTP hashes with an expiry in Redis
 * instead of process memory.
 */

const otps = new Map(); // phone -> { code, expiresAt }

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

function generateAndSend(phone) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otps.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });

  // DEMO ONLY: log to server console instead of sending a real SMS.
  console.log(`[OTP] ${phone} -> ${code} (demo mode, not actually sent via SMS)`);

  return code; // returned only so the demo route can echo it back for testing
}

function verify(phone, code) {
  const entry = otps.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otps.delete(phone);
    return false;
  }
  const ok = entry.code === code;
  if (ok) otps.delete(phone);
  return ok;
}

module.exports = { generateAndSend, verify };
