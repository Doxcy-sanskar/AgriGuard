/**
 * db.js — minimal file-based JSON persistence.
 *
 * This keeps the whole backend runnable with zero external database setup
 * (no Postgres/Mongo install needed to try the project). Each "table" is a
 * JSON file in ./data. Reads/writes are synchronous and fine for a demo or
 * small pilot; for real production scale, swap this module for a proper
 * database (PostgreSQL is recommended — see README "Scaling up").
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable(table) {
  const fp = filePath(table);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, "[]", "utf8");
    return [];
  }
  const raw = fs.readFileSync(fp, "utf8");
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeTable(table, rows) {
  fs.writeFileSync(filePath(table), JSON.stringify(rows, null, 2), "utf8");
}

function insert(table, row) {
  const rows = readTable(table);
  rows.push(row);
  writeTable(table, rows);
  return row;
}

function findAll(table, predicate = () => true) {
  return readTable(table).filter(predicate);
}

function findOne(table, predicate) {
  return readTable(table).find(predicate) || null;
}

function update(table, predicate, updater) {
  const rows = readTable(table);
  let updated = null;
  const next = rows.map((row) => {
    if (predicate(row)) {
      updated = { ...row, ...updater };
      return updated;
    }
    return row;
  });
  writeTable(table, next);
  return updated;
}

module.exports = { readTable, writeTable, insert, findAll, findOne, update };
