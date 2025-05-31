// ui.js
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card.js';
import { Badge } from './components/ui/badge.js';
import { formatDate } from './utils.js';

export function createResultsDisplay(stats, daysSet, isSample = false) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // Main card
    const card = document.createElement('div');
    card.className = Card().props.className + ' relative max-w-2xl mx-auto';

    // Sample data badge
    if (isSample) {
        const badge = document.createElement('div');
        badge.className = 'absolute top-4 right-4 z-10';
        const badgeInner = document.createElement('div');
        badgeInner.className = Badge({ variant: 'warning' }).props.className;
        badgeInner.textContent = 'dummy data';
        badge.appendChild(badgeInner);
        card.appendChild(badge);
    }

    // Card header with days remaining
    const header = document.createElement('div');
    header.className = CardHeader().props.className + ' text-center';
    
    const daysNumber = document.createElement('div');
    daysNumber.className = `text-7xl font-extrabold tracking-tight ${stats.left < 0 ? 'text-destructive' : 'text-primary'}`;
    daysNumber.textContent = stats.left;
    
    const daysLabel = document.createElement('div');
    daysLabel.className = CardDescription().props.className + ' uppercase tracking-wider font-semibold';
    daysLabel.textContent = 'Days Remaining';
    
    header.appendChild(daysNumber);
    header.appendChild(daysLabel);

    // Window information
    const windowInfo = document.createElement('div');
    windowInfo.className = 'flex flex-col sm:flex-row justify-center gap-4 bg-muted rounded-lg px-6 py-4 mb-6';

    const startDate = document.createElement('div');
    startDate.className = 'flex-1 text-center';
    startDate.innerHTML = `
        <div class="text-muted-foreground text-xs mb-1">Window Start</div>
        <div class="font-semibold text-lg">${formatDate(new Date(stats.windowStart))}</div>
    `;

    const endDate = document.createElement('div');
    endDate.className = 'flex-1 text-center';
    endDate.innerHTML = `
        <div class="text-muted-foreground text-xs mb-1">Window End</div>
        <div class="font-semibold text-lg">${formatDate(new Date(Date.now()))}</div>
    `;

    windowInfo.appendChild(startDate);
    windowInfo.appendChild(endDate);

    // Calendar content
    const content = document.createElement('div');
    content.className = CardContent().props.className;
    const calendar = createCalendarHeatmap(daysSet);
    content.appendChild(windowInfo);
    content.appendChild(calendar);

    // Usage summary footer
    const footer = document.createElement('div');
    footer.className = CardFooter().props.className + ' justify-center gap-4 bg-muted rounded-lg';
    footer.innerHTML = `
        <div class="flex-1 text-center">
            <div class="text-muted-foreground text-xs mb-1">Days Used</div>
            <div class="font-semibold text-xl">${stats.used}</div>
        </div>
        <div class="flex-1 text-center">
            <div class="text-muted-foreground text-xs mb-1">Days Available</div>
            <div class="font-semibold text-xl">90</div>
        </div>
    `;

    // Assemble card
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);

    resultsContainer.appendChild(card);
}

// Custom tooltip implementation remains the same
function ensureTooltipDiv() {
    let tooltip = document.getElementById('calendar-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'calendar-tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '9999';
        tooltip.style.background = 'hsl(var(--popover))';
        tooltip.style.color = 'hsl(var(--popover-foreground))';
        tooltip.style.padding = '6px 12px';
        tooltip.style.borderRadius = 'var(--radius)';
        tooltip.style.fontSize = '13px';
        tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        tooltip.style.transition = 'opacity 0.1s';
        tooltip.style.opacity = '0';
        document.body.appendChild(tooltip);
    }
    return tooltip;
}

function showTooltip(text, x, y) {
    const tooltip = ensureTooltipDiv();
    tooltip.textContent = text;
    tooltip.style.left = (x + 12) + 'px';
    tooltip.style.top = (y + 12) + 'px';
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    const tooltip = document.getElementById('calendar-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

function createCalendarHeatmap(daysSet) {
    const calendar = document.createElement('div');
    calendar.className = 'mt-6 rounded-lg p-4 flex flex-col';

    // Month and weekday names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 180);
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

    // Month labels
    let monthLabels = [];
    let lastMonth = null;
    for (let w = 0; w < weeks.length; w++) {
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

    const emptyLabel = document.createElement('div');
    emptyLabel.className = 'w-4 h-4';
    monthsContainer.appendChild(emptyLabel);

    for (let w = 0; w < weeks.length; w++) {
        const label = document.createElement('div');
        label.className = 'w-4 h-4 text-xs text-muted-foreground text-center';
        label.textContent = monthLabels[w];
        monthsContainer.appendChild(label);
    }

    // Render weekday labels column
    const weekdayCol = document.createElement('div');
    weekdayCol.className = 'flex flex-col gap-1.5 mr-1';
    for (let d = 0; d < 7; d++) {
        const wd = document.createElement('div');
        wd.className = 'text-xs text-muted-foreground w-4 h-4 text-center';
        wd.textContent = weekdays[d];
        weekdayCol.appendChild(wd);
    }

    // Render grid
    const grid = document.createElement('div');
    grid.className = 'flex gap-1.5';

    weeks.forEach(weekArr => {
        const weekCol = document.createElement('div');
        weekCol.className = 'flex flex-col gap-1.5';

        weekArr.forEach(date => {
            const cell = document.createElement('div');
            cell.className = 'w-4 h-4 rounded-sm transition-colors hover:border hover:border-border flex items-center justify-center';
            let tooltipText = '';
            if (date) {
                const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                const country = daysSet.get(utcMidnight);
                const isPresent = country !== undefined;
                if (isPresent && country.emoji) {
                    cell.textContent = country.emoji;
                    tooltipText = `${formatDate(date)}: ${country.name}`;
                    cell.style.cursor = 'pointer';
                } else if (isPresent) {
                    cell.classList.add('bg-primary');
                    tooltipText = `${formatDate(date)}: ${country.name}`;
                    cell.style.cursor = 'pointer';
                } else {
                    cell.classList.add('bg-muted');
                }
            } else {
                cell.classList.add('bg-transparent');
            }

            if (tooltipText) {
                cell.addEventListener('mouseenter', e => {
                    showTooltip(tooltipText, e.clientX, e.clientY);
                });
                cell.addEventListener('mousemove', e => {
                    showTooltip(tooltipText, e.clientX, e.clientY);
                });
                cell.addEventListener('mouseleave', hideTooltip);
            }
            weekCol.appendChild(cell);
        });

        grid.appendChild(weekCol);
    });

    const gridRow = document.createElement('div');
    gridRow.className = 'flex';
    gridRow.appendChild(weekdayCol);
    gridRow.appendChild(grid);

    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'overflow-x-auto w-full pb-2';
    scrollWrapper.appendChild(monthsContainer);
    scrollWrapper.appendChild(gridRow);

    calendar.appendChild(scrollWrapper);
    return calendar;
}

export function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
    }`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}