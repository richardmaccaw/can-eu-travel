// src/sampleData.js
// Sample data for demo results view

// 1. Sample stats object (matches windowStats output)
export const sampleStats = {
  used: 66,
  left: 24,
  windowStart: Date.now() - 179 * 86400000 // 180 days ago
};

// 2. Sample daysSet Map (UTC midnight ms -> country name)
// We'll mark 66 random days in the last 180 as 'France' for demo
export const sampleDaysSet = new Map();
const today = new Date();
const start = new Date(today);
start.setDate(start.getDate() - 180);
for (let i = 0; i < 66; i++) {
  const d = new Date(start);
  d.setDate(d.getDate() + i * 2 + 1); // every other day
  const utcMid = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  sampleDaysSet.set(utcMid, 'France');
} 