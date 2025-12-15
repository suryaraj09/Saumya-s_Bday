// ===================================
// State Management
// ===================================
let currentSide = 1;
let visitorName = '';
let hasSubmittedRSVP = false;

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if visitor name exists in localStorage
    const storedName = localStorage.getItem('visitorName');
    const storedRSVP = localStorage.getItem('hasSubmittedRSVP');

    if (storedName) {
        visitorName = storedName;
        // Skip to side 2 if name already exists
        navigateToSide(2);
    }

    if (storedRSVP === 'true') {
        hasSubmittedRSVP = true;
    }

    // Set up form submission
    const nameForm = document.getElementById('nameForm');
    nameForm.addEventListener('submit', handleNameSubmit);

    // Update visitor name displays
    updateVisitorNameDisplays();
});

// ===================================
// Name Form Handling
// ===================================
function handleNameSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('visitorName');
    const name = nameInput.value.trim();

    if (name.length < 2) {
        alert('Please enter a valid name');
        return;
    }

    // Store name
    visitorName = name;
    localStorage.setItem('visitorName', name);

    // Update displays
    updateVisitorNameDisplays();

    // Navigate to next side
    navigateToSide(2);
}

function updateVisitorNameDisplays() {
    const displays = document.querySelectorAll('.visitor-name-display');
    displays.forEach(display => {
        display.textContent = visitorName;
    });
}

// ===================================
// Navigation Between Sides
// ===================================
function navigateToSide(targetSide) {
    if (targetSide === currentSide) return;

    const currentCard = document.getElementById(`side${currentSide}`);
    const targetCard = document.getElementById(`side${targetSide}`);

    if (!currentCard || !targetCard) return;

    // Determine direction
    const direction = targetSide > currentSide ? 'left' : 'right';

    // Exit current card
    currentCard.classList.remove('active');
    currentCard.classList.add(`exit-${direction}`);

    // Enter target card
    setTimeout(() => {
        currentCard.classList.remove(`exit-${direction}`);
        targetCard.classList.add('active');
        currentSide = targetSide;

        // Update navigation dots if on side 4
        updateNavigationDots();
    }, 100);
}

function updateNavigationDots() {
    const dots = document.querySelectorAll('.navigation-dots .dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ===================================
// RSVP Submission
// ===================================
async function submitRSVP(response) {
    // Validate visitor name
    if (!visitorName) {
        alert('Please enter your name first');
        navigateToSide(1);
        return;
    }

    // Prepare data
    const rsvpData = {
        name: visitorName,
        response: response,
        timestamp: new Date().toISOString()
    };

    try {
        // Determine API URL (works for both local and production)
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api/rsvp'
            : '/api/rsvp';

        // Determine if this is an update or new submission
        const method = hasSubmittedRSVP ? 'PUT' : 'POST';

        // Submit to backend
        const result = await fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rsvpData)
        });

        if (!result.ok) {
            throw new Error('Failed to submit RSVP');
        }

        // Mark as submitted
        hasSubmittedRSVP = true;
        localStorage.setItem('hasSubmittedRSVP', 'true');

        // Show confirmation
        const message = response === 'yes'
            ? `Wonderful! We can't wait to celebrate with you, ${visitorName}! 🎉`
            : `We'll miss you, ${visitorName}. Hope to see you soon! 💙`;

        showConfirmation(message);

    } catch (error) {
        console.error('Error submitting RSVP:', error);

        // Fallback: Store locally if backend is unavailable
        localStorage.setItem('rsvpData', JSON.stringify(rsvpData));
        hasSubmittedRSVP = true;
        localStorage.setItem('hasSubmittedRSVP', 'true');

        const message = response === 'yes'
            ? `Wonderful! We can't wait to celebrate with you, ${visitorName}! 🎉`
            : `We'll miss you, ${visitorName}. Hope to see you soon! 💙`;

        showConfirmation(message);
    }
}

function changeRSVP() {
    // Reset confirmation view
    const rsvpButtons = document.getElementById('rsvpButtons');
    const rsvpQuestion = document.getElementById('rsvpQuestion');
    const confirmation = document.getElementById('rsvpConfirmation');

    rsvpButtons.classList.remove('hidden');
    rsvpQuestion.classList.remove('hidden');
    confirmation.classList.add('hidden');

    // Note: We keep hasSubmittedRSVP = true so the next submission will be treated as an update
}

function showConfirmation(message) {
    // Hide RSVP buttons
    const rsvpButtons = document.getElementById('rsvpButtons');
    const rsvpQuestion = document.getElementById('rsvpQuestion');
    const confirmation = document.getElementById('rsvpConfirmation');
    const confirmationMessage = document.getElementById('confirmationMessage');

    rsvpButtons.classList.add('hidden');
    rsvpQuestion.classList.add('hidden');

    // Show confirmation
    confirmationMessage.textContent = message;
    confirmation.classList.remove('hidden');
}

// ===================================
// Utility Functions
// ===================================
function resetInvitation() {
    // Clear all stored data (for testing purposes)
    localStorage.removeItem('visitorName');
    localStorage.removeItem('hasSubmittedRSVP');
    localStorage.removeItem('rsvpData');
    location.reload();
}

// Make functions globally accessible
window.navigateToSide = navigateToSide;
window.submitRSVP = submitRSVP;
window.changeRSVP = changeRSVP;
window.resetInvitation = resetInvitation;
