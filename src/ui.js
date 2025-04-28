// ui.js
// Future: Functions for rendering results, updating the UI, showing alerts, etc.

import { formatDate } from './utils.js';

export function createResultsDisplay(stats, daysSet) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear existing content
    
    // Create main card
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto';
    
    // Remaining days (big number)
    const remainingDays = document.createElement('div');
    remainingDays.className = 'text-center mb-6';
    const daysNumber = document.createElement('div');
    daysNumber.className = `text-6xl font-bold mb-2 ${stats.left < 0 ? 'text-red-600' : 'text-green-600'}`;
    daysNumber.textContent = stats.left;
    const daysLabel = document.createElement('div');
    daysLabel.className = 'text-gray-600';
    daysLabel.textContent = 'Days Remaining';
    remainingDays.appendChild(daysNumber);
    remainingDays.appendChild(daysLabel);
    
    // Window information
    const windowInfo = document.createElement('div');
    windowInfo.className = 'grid grid-cols-2 gap-4 mb-6 text-center';
    
    const startDate = document.createElement('div');
    startDate.innerHTML = `
        <div class="text-gray-600 text-sm">Window Start</div>
        <div class="font-semibold">${formatDate(new Date(stats.windowStart))}</div>
    `;
    
    const endDate = document.createElement('div');
    endDate.innerHTML = `
        <div class="text-gray-600 text-sm">Window End</div>
        <div class="font-semibold">${formatDate(new Date(Date.now()))}</div>
    `;
    
    windowInfo.appendChild(startDate);
    windowInfo.appendChild(endDate);
    
    // Calendar heat map
    const calendar = createCalendarHeatmap(daysSet);
    
    // Overstay alert if necessary
    if (stats.left < 0) {
        const alert = document.createElement('div');
        alert.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6';
        alert.innerHTML = `
            <p class="font-bold">Warning: Overstay Risk</p>
            <p>You have exceeded the 90-day limit by ${Math.abs(stats.left)} days.</p>
        `;
        card.appendChild(alert);
    }
    
    // Usage summary
    const summary = document.createElement('div');
    summary.className = 'grid grid-cols-2 gap-4 text-center bg-gray-50 rounded-lg p-4 mt-6';
    summary.innerHTML = `
        <div>
            <div class="text-gray-600 text-sm">Days Used</div>
            <div class="font-semibold text-xl">${stats.used}</div>
        </div>
        <div>
            <div class="text-gray-600 text-sm">Days Available</div>
            <div class="font-semibold text-xl">90</div>
        </div>
    `;
    
    // Assemble all components
    card.appendChild(remainingDays);
    card.appendChild(windowInfo);
    card.appendChild(calendar);
    card.appendChild(summary);
    
    resultsContainer.appendChild(card);
}

function createCalendarHeatmap(daysSet) {
    const calendar = document.createElement('div');
    calendar.className = 'mt-6 bg-white rounded-lg p-4';
    
    // Create month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180); // 180 days ago
    
    // Month labels container
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'flex mb-2';
    
    // Calculate days per month for proper spacing
    const monthDays = new Array(6).fill(0);
    let currentMonth = startDate.getMonth();
    let monthIndex = 0;
    
    for (let i = 0; i < 180; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        if (date.getMonth() !== currentMonth) {
            monthIndex++;
            currentMonth = date.getMonth();
        }
        monthDays[monthIndex]++;
    }
    
    // Create month labels with proper widths
    for (let i = 0; i < 6; i++) {
        const monthIndex = (startDate.getMonth() + i) % 12;
        const monthLabel = document.createElement('div');
        monthLabel.className = 'text-xs text-gray-500';
        monthLabel.style.width = `${(monthDays[i] * 20)}px`; // 20px per day
        monthLabel.style.marginRight = '4px'; // Gap between months
        monthLabel.textContent = months[monthIndex];
        monthsContainer.appendChild(monthLabel);
    }
    
    // Create day grid
    const grid = document.createElement('div');
    grid.className = 'flex flex-wrap gap-1';
    
    for (let i = 0; i < 180; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const cell = document.createElement('div');
        // Convert the date to UTC midnight timestamp for comparison
        const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        const country = daysSet.get(utcMidnight);
        const isPresent = country !== undefined;
        
        cell.className = `w-4 h-4 rounded-sm ${
            isPresent ? 'bg-blue-500' : 'bg-gray-100'
        } transition-colors hover:border hover:border-gray-300`;
        cell.title = `${formatDate(date)}: ${isPresent ? country : 'Not present'}`;
        
        grid.appendChild(cell);
    }
    
    calendar.appendChild(monthsContainer);
    calendar.appendChild(grid);
    return calendar;
}

export function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
} 