// main.js

// Setup drag-and-drop and file input logic
function setupDropZone() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

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
function handleFile(file) {
  console.log('File received:', file.name);
  // TODO: Add file processing logic here
  alert(`File received: ${file.name}\nProcessing will be implemented in the next step.`);
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', setupDropZone); 