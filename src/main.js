// main.js
import './tailwind.css';
import { timelineToFixes } from './fileHandler.js';
import { collectSchengenDays, windowStats } from './schengen.js';
import { msToUTCmidnight } from './utils.js';
import { createResultsDisplay, showAlert } from './ui.js';
import { sampleStats, sampleDaysSet } from './sampleData.js';

// Setup drag-and-drop and file input logic
function setupDropZone() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  // Show sample results on first load
  showSampleResults();

  // Trigger file input when drop zone is clicked
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection through the file input
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  // Highlight drop zone when dragging files over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('border-indigo-500', 'bg-indigo-50');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
    });
  });

  // Handle dropped files
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}

// Function to handle the uploaded file
async function handleFile(file) {
  try {
    // Hide sample results if present
    hideSampleBanner();
    const text = await file.text();
    const jsonArray = JSON.parse(text);
    const visits = Array.from(timelineToFixes(jsonArray));
    const daysSet = await collectSchengenDays(visits);
    const dayArray = [...daysSet.keys()].sort((a, b) => a - b);
    const todayMidn = msToUTCmidnight(Date.now());
    const stats = windowStats(dayArray, todayMidn);
    
    // Hide the drop zone
    document.getElementById('drop-zone').style.display = 'none';
    
    // Show the results
    createResultsDisplay(stats, daysSet, false);
  } catch (err) {
    showAlert('Error reading file: ' + err.message);
  }
}

// Show sample results with a badge in the results card
function showSampleResults() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  createResultsDisplay(sampleStats, sampleDaysSet, true);
}

function hideSampleBanner() {
  // No longer needed, but kept for compatibility if called
  const banner = document.getElementById('sample-banner');
  if (banner) banner.remove();
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', setupDropZone); 