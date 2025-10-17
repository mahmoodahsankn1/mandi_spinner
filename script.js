// State management
let state = {
    inputMode: 'custom',
    quarters: 0,
    customQuarters: [],
    chestCount: 0,
    legCount: 0,
    people: [],
    assignments: [],
    isSpinning: false,
    lastResult: null
};

// Toast notification system
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : '⚠';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slide-in 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Calculate pieces from quarters
function calculatePiecesFromQuarters(numQuarters) {
    const chest = Math.floor(numQuarters / 2);
    const leg = Math.ceil(numQuarters / 2);
    return { chest, leg };
}

// Get current piece counts
function getCurrentPieceCounts() {
    if (state.inputMode === 'custom') {
        const chest = state.customQuarters.filter(q => q.type === 'chest').length;
        const leg = state.customQuarters.filter(q => q.type === 'leg').length;
        return { chest, leg };
    } else {
        return { chest: state.chestCount, leg: state.legCount };
    }
}

// Update quarters grid
function updateQuartersGrid() {
    const grid = document.getElementById('quarters-grid');
    grid.innerHTML = '';
    
    state.customQuarters.forEach(quarter => {
        const btn = document.createElement('button');
        btn.className = `quarter-btn ${quarter.type}`;
        btn.disabled = state.isSpinning;
        btn.innerHTML = `
            <div class="quarter-number">Q${quarter.id}</div>
            <div class="quarter-icon">${quarter.type === 'chest' ? '🍗' : '🍖'}</div>
            <div class="quarter-type">${quarter.type}</div>
        `;
        btn.onclick = () => toggleQuarterType(quarter.id);
        grid.appendChild(btn);
    });
    
    updateSummary();
}

// Toggle quarter type
function toggleQuarterType(id) {
    state.customQuarters = state.customQuarters.map(q => 
        q.id === id ? { ...q, type: q.type === 'chest' ? 'leg' : 'chest' } : q
    );
    updateQuartersGrid();
}

// Handle quarters input change
function handleQuartersChange(value) {
    if (value === '') {
        state.quarters = 0;
        state.customQuarters = [];
        updateQuartersGrid();
        return;
    }
    
    const numQuarters = Math.max(0, parseInt(value) || 0);
    state.quarters = numQuarters;
    
    const newQuarters = [];
    for (let i = 1; i <= numQuarters; i++) {
        newQuarters.push({
            id: i,
            type: i % 2 === 1 ? 'chest' : 'leg'
        });
    }
    state.customQuarters = newQuarters;
    updateQuartersGrid();
}

// Update summary displays
function updateSummary() {
    const { chest, leg } = getCurrentPieceCounts();
    
    if (state.inputMode === 'custom') {
        document.getElementById('custom-summary').textContent = 
            `Your Selection: ${chest} Chest + ${leg} Leg${leg !== 1 ? 's' : ''}`;
    } else {
        document.getElementById('manual-summary').textContent = 
            `Total: ${chest + leg} pieces (${chest} Chest + ${leg} Leg${leg !== 1 ? 's' : ''})`;
    }
    
    updateStats();
}

// Update stats
function updateStats() {
    const { chest: totalChest, leg: totalLeg } = getCurrentPieceCounts();
    const assignedChest = state.assignments.filter(a => a.piece === 'chest').length;
    const assignedLeg = state.assignments.filter(a => a.piece === 'leg').length;
    const remainingChest = totalChest - assignedChest;
    const remainingLeg = totalLeg - assignedLeg;
    const remainingTotal = remainingChest + remainingLeg;
    const remainingPeople = state.people.filter(p => !state.assignments.some(a => a.person === p));
    
    const total = remainingChest + remainingLeg;
    const chestPercent = total === 0 ? 50 : (remainingChest / total) * 100;
    const legPercent = total === 0 ? 50 : (remainingLeg / total) * 100;
    
    document.getElementById('stats-text').innerHTML = 
        `<strong>Remaining:</strong> ${remainingTotal} pieces (${remainingChest} Chest, ${remainingLeg} Legs) | ${remainingPeople.length} people`;
    
    document.getElementById('chest-percent').textContent = `🍗 Chest: ${chestPercent.toFixed(0)}%`;
    document.getElementById('leg-percent').textContent = `🍖 Leg: ${legPercent.toFixed(0)}%`;
    
    // Update wheel
    const wheel = document.getElementById('wheel');
    wheel.style.background = `conic-gradient(
        hsl(9, 100%, 64%) 0% ${chestPercent}%, 
        hsl(43, 74%, 49%) ${chestPercent}% 100%
    )`;
    
    // Update spin button
    const spinBtn = document.getElementById('btn-spin');
    spinBtn.disabled = state.isSpinning || remainingPeople.length === 0 || remainingTotal === 0;
}

// Add person
function addPerson() {
    const input = document.getElementById('person-input');
    const name = input.value.trim();
    
    if (!name) {
        showToast('Please enter a name', 'error');
        return;
    }
    
    if (state.people.includes(name)) {
        showToast('This person is already added', 'error');
        return;
    }
    
    state.people.push(name);
    input.value = '';
    updatePeopleList();
    showToast(`${name} added!`);
}

// Remove person
function removePerson(name) {
    state.people = state.people.filter(p => p !== name);
    updatePeopleList();
    showToast(`${name} removed`);
}

// Update people list
function updatePeopleList() {
    const list = document.getElementById('people-list');
    
    if (state.people.length === 0) {
        list.innerHTML = '';
        updateStats();
        return;
    }
    
    list.innerHTML = state.people.map(person => {
        const isAssigned = state.assignments.some(a => a.person === person);
        const removeBtn = !isAssigned ? `
            <button class="badge-remove" onclick="removePerson('${person}')" ${state.isSpinning ? 'disabled' : ''}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        ` : '';
        
        return `
            <div class="badge ${isAssigned ? 'badge-secondary' : 'badge-default'}">
                ${person}
                ${removeBtn}
            </div>
        `;
    }).join('');
    
    updateStats();
}

// Spin the wheel
function spinWheel() {
    const { chest: totalChest, leg: totalLeg } = getCurrentPieceCounts();
    const assignedChest = state.assignments.filter(a => a.piece === 'chest').length;
    const assignedLeg = state.assignments.filter(a => a.piece === 'leg').length;
    const remainingChest = totalChest - assignedChest;
    const remainingLeg = totalLeg - assignedLeg;
    const remainingTotal = remainingChest + remainingLeg;
    const remainingPeople = state.people.filter(p => !state.assignments.some(a => a.person === p));
    
    if (remainingPeople.length === 0) {
        showToast('No people available to spin!', 'error');
        return;
    }
    
    if (remainingTotal === 0) {
        showToast('No pieces remaining!', 'error');
        return;
    }
    
    state.isSpinning = true;
    state.lastResult = null;
    
    // Update UI
    document.getElementById('wheel').classList.add('spinning');
    document.getElementById('wheel-center').textContent = '🎲';
    document.getElementById('spinning-text').classList.remove('hidden');
    document.getElementById('result-display').classList.add('hidden');
    updateStats();
    updateButtons();
    
    setTimeout(() => {
        // Select random person
        const randomPerson = remainingPeople[Math.floor(Math.random() * remainingPeople.length)];
        
        // Select random piece weighted by availability
        const totalPieces = remainingChest + remainingLeg;
        const chestProbability = remainingChest / totalPieces;
        const randomValue = Math.random();
        const selectedPiece = randomValue < chestProbability ? 'chest' : 'leg';
        
        // Add assignment
        const newAssignment = { person: randomPerson, piece: selectedPiece };
        state.assignments.push(newAssignment);
        state.lastResult = newAssignment;
        state.isSpinning = false;
        
        // Update UI
        document.getElementById('wheel').classList.remove('spinning');
        document.getElementById('wheel-center').textContent = '🎯';
        document.getElementById('spinning-text').classList.add('hidden');
        
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.classList.remove('hidden');
        document.getElementById('result-person').textContent = `🎉 ${randomPerson} 🎉`;
        document.getElementById('result-piece').innerHTML = 
            `Gets a <span class="${selectedPiece === 'chest' ? 'text-chest' : 'text-leg'}">
                ${selectedPiece === 'chest' ? '🍗 CHEST' : '🍖 LEG'}
            </span> piece!`;
        
        updateStats();
        updateButtons();
        updatePeopleList();
        updateAssignmentsList();
        
        showToast(`🎉 ${randomPerson} gets a ${selectedPiece === 'chest' ? '🍗 CHEST' : '🍖 LEG'} piece!`);
    }, 3000);
}

// Update assignments list
function updateAssignmentsList() {
    const card = document.getElementById('assignments-card');
    const list = document.getElementById('assignments-list');
    
    if (state.assignments.length === 0) {
        card.classList.add('hidden');
        return;
    }
    
    card.classList.remove('hidden');
    list.innerHTML = state.assignments.map((assignment, index) => `
        <div class="assignment-item">
            <span class="assignment-person">${assignment.person}</span>
            <div class="assignment-badge ${assignment.piece}">
                ${assignment.piece === 'chest' ? '🍗 CHEST' : '🍖 LEG'}
            </div>
        </div>
    `).join('');
}

// Update buttons state
function updateButtons() {
    const buttons = document.querySelectorAll('button, input');
    buttons.forEach(btn => {
        if (btn.id !== 'btn-reset') {
            btn.disabled = state.isSpinning;
        }
    });
}

// Reset everything
function resetAll() {
    state = {
        inputMode: 'custom',
        quarters: 0,
        customQuarters: [],
        chestCount: 0,
        legCount: 0,
        people: [],
        assignments: [],
        isSpinning: false,
        lastResult: null
    };
    
    document.getElementById('quarters-input').value = '';
    document.getElementById('chest-input').value = 0;
    document.getElementById('leg-input').value = 0;
    document.getElementById('person-input').value = '';
    document.getElementById('result-display').classList.add('hidden');
    
    updateQuartersGrid();
    updateSummary();
    updatePeopleList();
    updateAssignmentsList();
    updateButtons();
    
    showToast('Reset complete!');
}

// Switch mode
function switchMode(mode) {
    state.inputMode = mode;
    
    const customBtn = document.getElementById('btn-custom-mode');
    const manualBtn = document.getElementById('btn-manual-mode');
    const customContent = document.getElementById('custom-mode-content');
    const manualContent = document.getElementById('manual-mode-content');
    
    if (mode === 'custom') {
        customBtn.classList.add('active');
        manualBtn.classList.remove('active');
        customContent.classList.remove('hidden');
        manualContent.classList.add('hidden');
    } else {
        customBtn.classList.remove('active');
        manualBtn.classList.add('active');
        customContent.classList.add('hidden');
        manualContent.classList.remove('hidden');
    }
    
    updateSummary();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Mode switching
    document.getElementById('btn-custom-mode').addEventListener('click', () => switchMode('custom'));
    document.getElementById('btn-manual-mode').addEventListener('click', () => switchMode('manual'));
    
    // Quarters input
    document.getElementById('quarters-input').addEventListener('input', (e) => handleQuartersChange(e.target.value));
    
    // Manual inputs
    document.getElementById('chest-input').addEventListener('input', (e) => {
        state.chestCount = Math.max(0, parseInt(e.target.value) || 0);
        updateSummary();
    });
    
    document.getElementById('leg-input').addEventListener('input', (e) => {
        state.legCount = Math.max(0, parseInt(e.target.value) || 0);
        updateSummary();
    });
    
    // Person input
    document.getElementById('person-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addPerson();
    });
    
    document.getElementById('btn-add-person').addEventListener('click', addPerson);
    
    // Spin button
    document.getElementById('btn-spin').addEventListener('click', spinWheel);
    
    // Reset button
    document.getElementById('btn-reset').addEventListener('click', resetAll);
    
    // Initialize
    updateSummary();
    updateStats();
});
