// utils.js
// Future: Utility/helper functions for date formatting, array operations, etc.

export function formatDate(date) {
  // Placeholder for date formatting
  return date.toISOString().split('T')[0];
}

export function msToUTCmidnight(ms) {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
} 