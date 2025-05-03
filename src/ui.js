// ui.js
// Future: Functions for rendering results, updating the UI, showing alerts, etc.

import { formatDate } from './utils.js';

export function createResultsDisplay(stats, daysSet, isSample = false) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // Main card with more space, shadow, and rounded corners
    const card = document.createElement('div');
    card.className = 'relative bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto flex flex-col gap-8';

    // Dummy data badge (floating, soft yellow, subtle shadow)
    if (isSample) {
        const badge = document.createElement('div');
        badge.className = 'absolute top-4 right-4 z-10';
        badge.innerHTML = `<span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow border border-yellow-200 select-none">dummy data</span>`;
        card.appendChild(badge);
    }

    // Days Remaining (big number, clear label)
    const remainingDays = document.createElement('div');
    remainingDays.className = 'flex flex-col items-center gap-2';
    const daysNumber = document.createElement('div');
    daysNumber.className = `text-7xl font-extrabold tracking-tight ${stats.left < 0 ? 'text-red-600' : 'text-blue-600'}`;
    daysNumber.textContent = stats.left;
    const daysLabel = document.createElement('div');
    daysLabel.className = 'uppercase text-xs tracking-wider text-gray-500 font-semibold';
    daysLabel.textContent = 'Days Remaining';
    remainingDays.appendChild(daysNumber);
    remainingDays.appendChild(daysLabel);

    // Window information (dates)
    const windowInfo = document.createElement('div');
    windowInfo.className = 'flex flex-col sm:flex-row justify-center gap-4 bg-blue-50 rounded-lg px-6 py-4';

    const startDate = document.createElement('div');
    startDate.className = 'flex-1 text-center';
    startDate.innerHTML = `
        <div class="text-gray-500 text-xs mb-1">Window Start</div>
        <div class="font-semibold text-lg text-gray-800">${formatDate(new Date(stats.windowStart))}</div>
    `;

    const endDate = document.createElement('div');
    endDate.className = 'flex-1 text-center';
    endDate.innerHTML = `
        <div class="text-gray-500 text-xs mb-1">Window End</div>
        <div class="font-semibold text-lg text-gray-800">${formatDate(new Date(Date.now()))}</div>
    `;

    windowInfo.appendChild(startDate);
    windowInfo.appendChild(endDate);

    // Calendar heat map
    const calendar = createCalendarHeatmap(daysSet);

    // Usage summary (days used/available)
    const summary = document.createElement('div');
    summary.className = 'flex flex-col sm:flex-row justify-center gap-4 bg-gray-50 rounded-lg px-6 py-4';
    summary.innerHTML = `
        <div class="flex-1 text-center">
            <div class="text-gray-500 text-xs mb-1">Days Used</div>
            <div class="font-semibold text-xl text-gray-800">${stats.used}</div>
        </div>
        <div class="flex-1 text-center">
            <div class="text-gray-500 text-xs mb-1">Days Available</div>
            <div class="font-semibold text-xl text-gray-800">90</div>
        </div>
    `;

    // Assemble all components in order
    card.appendChild(remainingDays);
    card.appendChild(windowInfo);
    card.appendChild(calendar);
    card.appendChild(summary);

    resultsContainer.appendChild(card);
}

function createCalendarHeatmap(daysSet) {
    const calendar = document.createElement('div');
    calendar.className = 'mt-6 bg-white rounded-lg p-4 flex flex-col';

    // Month and weekday names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];  // Monday‑first
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180); // 180 days ago
    startDate.setHours(0, 0, 0, 0);

    // Build array of all days in the window
    let days = [];
    for (let i = 0; i < 180; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        days.push(new Date(date));
    }

    // Arrange days into columns (weeks)
    let weeks = [];
    let week = new Array(7).fill(null);
    // Convert JS getDay() (Sun = 0) to Monday‑first index (Mon = 0)
    let dayIdx = (startDate.getDay() + 6) % 7;
    for (let i = 0; i < days.length; i++) {
        week[dayIdx] = days[i];
        dayIdx++;
        if (dayIdx === 7) {
            weeks.push(week);
            week = new Array(7).fill(null);
            dayIdx = 0;
        }
    }
    if (week.some(d => d !== null)) {
        weeks.push(week);
    }

    // Month labels: label above the first week column where the month starts
    let monthLabels = [];
    let lastMonth = null;
    for (let w = 0; w < weeks.length; w++) {
        // Find the first non-null day in this week
        let firstDay = weeks[w].find(d => d !== null);
        if (firstDay && (firstDay.getMonth() !== lastMonth)) {
            monthLabels[w] = months[firstDay.getMonth()];
            lastMonth = firstDay.getMonth();
        } else {
            monthLabels[w] = '';
        }
    }

    // Render month labels row
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'flex gap-1.5 mb-1';

    // Spacer that lines up with the weekday‑label column
    const emptyLabel = document.createElement('div');
    emptyLabel.className = 'w-4 h-4';
    monthsContainer.appendChild(emptyLabel);

    for (let w = 0; w < weeks.length; w++) {
        const label = document.createElement('div');
        label.className = 'w-4 h-4 text-xs text-gray-500 text-center';
        label.textContent = monthLabels[w];
        monthsContainer.appendChild(label);
    }

    // Render weekday labels column (left of grid)
    const weekdayCol = document.createElement('div');
    // Stack weekday labels vertically with a small gap
    weekdayCol.className = 'flex flex-col gap-1.5 mr-1';
    for (let d = 0; d < 7; d++) {
        const wd = document.createElement('div');
        wd.className = 'text-xs text-gray-700 w-4 h-4 text-center';
        wd.textContent = weekdays[d];
        weekdayCol.appendChild(wd);
    }

    // Render grid: one flex column per week
    const grid = document.createElement('div');
    grid.className = 'flex gap-1.5';

    weeks.forEach(weekArr => {
        const weekCol = document.createElement('div');
        weekCol.className = 'flex flex-col gap-1.5';

        weekArr.forEach(date => {
            const cell = document.createElement('div');
            cell.className = 'w-4 h-4 rounded-sm transition-colors hover:border hover:border-gray-300';
            if (date) {
                const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                const country = daysSet.get(utcMidnight);
                const isPresent = country !== undefined;
                cell.classList.add(isPresent ? 'bg-blue-500' : 'bg-gray-100');
                cell.title = `${formatDate(date)}: ${isPresent ? country : 'Not present'}`;
            } else {
                cell.classList.add('bg-transparent');
            }
            weekCol.appendChild(cell);
        });

        grid.appendChild(weekCol);
    });

    // Wrap weekday labels and grid in a flex row
    const gridRow = document.createElement('div');
    // Keep the weekday labels and the calendar grid side‑by‑side
    gridRow.className = 'flex';
    gridRow.appendChild(weekdayCol);
    gridRow.appendChild(grid);

    calendar.appendChild(monthsContainer);
    calendar.appendChild(gridRow);
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