const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('trades.db');

db.run(`CREATE TABLE IF NOT EXISTS candles (
  timestamp TEXT,
  open REAL,
  high REAL,
  low REAL,
  close REAL,
  volume INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS trades (
  timestamp TEXT,
  figi TEXT,
  price REAL,
  direction TEXT,
  profit REAL
)`);

function saveCandle(candle) {
  db.run(`INSERT INTO candles (timestamp, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?)`,
    [candle.time, candle.open, candle.high, candle.low, candle.close, candle.volume]);
}

function logTrade(figi, price, direction, profit) {
  db.run(`INSERT INTO trades (timestamp, figi, price, direction, profit) VALUES (?, ?, ?, ?, ?)`,
    [new Date().toISOString(), figi, price, direction, profit]);
}

module.exports = { saveCandle, logTrade };