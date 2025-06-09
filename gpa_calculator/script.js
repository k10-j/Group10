// Global array to store all assignments
let entries = [];

// Load data from localStorage on page load
window.addEventListener('load', loadData);

// Add keyboard event listener for 'S' key (only when not typing in inputs)
document.addEventListener('keydown', function(event) {
    // Check if user is typing in an input field
    const isTypingInInput = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
    
    if (event.key.toLowerCase() === 's' && !isTypingInInput) {
        logDataToConsole();
    }
});

// Allow Enter key to add assignment
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addAssignment();
    }
});

function addAssignment() {
    const nameInput = document.getElementById('assignmentName');
    const gradeInput = document.getElementById('gradeInput');
    
    const name = nameInput.value.trim();
    const grade = parseFloat(gradeInput.value);

    // Validation
    if (!name) {
        alert('Please enter an assignment name!');
        nameInput.focus();
        return;
    }

    if (isNaN(grade) || grade < 0 || grade > 5) {
        alert('Please enter a valid grade between 0 and 5!');
        gradeInput.focus();
        return;
    }

    // Create new assignment object
    const assignment = {
        name: name,
        grade: grade,
        id: Date.now() // Simple unique ID
    };

    // Add to entries array
    entries.push(assignment);

    // Update display
    updateGPADisplay();
    renderAssignments();
    saveData();

    // Clear inputs
    nameInput.value = '';
    gradeInput.value = '';
    nameInput.focus();

    console.log('Assignment added:', assignment);
}

function calculateGPA() {
    if (entries.length === 0) return 0;

    // Calculate average using reduce method
    const totalGrades = entries.reduce((sum, assignment) => sum + assignment.grade, 0);
    return totalGrades / entries.length;
}

function updateGPADisplay() {
    const gpa = calculateGPA();
    document.getElementById('gpaValue').textContent = gpa.toFixed(2);
    document.getElementById('assignmentCount').textContent = entries.length;
}

function renderAssignments() {
    const listContainer = document.getElementById('assignmentsList');
    
    if (entries.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No assignments added yet. Add your first assignment above!</p>';
        return;
    }

    // Generate HTML for all assignments
    const assignmentsHTML = entries.map(assignment => `
        <div class="assignment-item">
            <span class="assignment-name">${escapeHtml(assignment.name)}</span>
            <span class="assignment-grade">${assignment.grade.toFixed(1)}/5.0</span>
        </div>
    `).join('');

    listContainer.innerHTML = assignmentsHTML;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function logDataToConsole() {
    console.clear();
    console.log('=== GPA CALCULATOR DATA ===');
    console.log('Current GPA:', calculateGPA().toFixed(2));
    console.log('Total Assignments:', entries.length);
    console.log('All Assignments:');
    
    if (entries.length === 0) {
        console.log('No assignments found.');
    } else {
        entries.forEach((assignment, index) => {
            console.log(`${index + 1}. ${assignment.name}: ${assignment.grade}/5.0`);
        });
    }
    
    console.log('Raw Data:', entries);
    alert('📊 Data logged to console! Open Developer Tools (F12) to view.');
}

function clearAllData() {
    if (entries.length === 0) {
        alert('No data to clear!');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete all ${entries.length} assignments? This cannot be undone.`);
    
    if (confirmed) {
        entries = [];
        updateGPADisplay();
        renderAssignments();
        saveData();
        alert('All data cleared successfully!');
        document.getElementById('assignmentName').focus();
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('gpaCalculatorData', JSON.stringify(entries));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.log('LocalStorage not available, data saved in memory only');
    }
}

// Load data from localStorage
function loadData() {
    try {
        const savedData = localStorage.getItem('gpaCalculatorData');
        if (savedData) {
            entries = JSON.parse(savedData);
            console.log('Data loaded from localStorage:', entries);
        }
    } catch (error) {
        console.log('Could not load data from localStorage');
        entries = [];
    }
    
    updateGPADisplay();
    renderAssignments();
    document.getElementById('assignmentName').focus();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 GPA Calculator initialized!');
    console.log('📝 Press "S" to log data to console');
    document.getElementById('assignmentName').focus();
});

