// src/sampleData.js
// Sample data for demo results view

// 1. Sample stats object (matches windowStats output)
export const sampleStats = {
  used: 66,
  left: 24,
  windowStart: Date.now() - 179 * 86400000 // 180 days ago
};

// 2. Sample daysSet Map (UTC midnight ms -> country name)
// We'll mark a few random week-long or weekend trips to different Schengen countries for demo
export const sampleDaysSet = new Map();
const today = new Date();
const start = new Date(today);
start.setDate(start.getDate() - 180);

// Minimal country data for demo (name + emoji)
const countryData = {
  'France': { name: 'France', emoji: '🇫🇷' },
  'Germany': { name: 'Germany', emoji: '🇩🇪' },
  'Italy': { name: 'Italy', emoji: '🇮🇹' },
  'Spain': { name: 'Spain', emoji: '🇪🇸' },
  'Netherlands': { name: 'Netherlands', emoji: '🇳🇱' },
  'Austria': { name: 'Austria', emoji: '🇦🇹' }
};

function addTrip(startOffset, length, country) {
  for (let i = 0; i < length; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + startOffset + i);
    const utcMid = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    sampleDaysSet.set(utcMid, countryData[country]);
  }
}

// Simulate a few trips
addTrip(5, 7, 'France');      // 1 week in France
addTrip(30, 3, 'Germany');    // long weekend in Germany
addTrip(60, 8, 'Italy');      // 8 days in Italy
addTrip(100, 2, 'Spain');     // quick weekend in Spain
addTrip(140, 5, 'Netherlands'); // 5 days in Netherlands
addTrip(170, 4, 'Austria');   // 4 days in Austria 