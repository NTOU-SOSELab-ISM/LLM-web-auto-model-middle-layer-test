// Elements
const switchBackgroundBtn = document.getElementById('switchBackground');
const body = document.body;
const textToType = document.getElementById('textToType');
const typingInput = document.getElementById('typingInput');
const addTextBtn = document.getElementById('addTextBtn');
const addTextModal = document.getElementById('addTextModal');
const customTextInput = document.getElementById('customTextInput');
const submitCustomText = document.getElementById('submitCustomText');
const cancelCustomText = document.getElementById('cancelCustomText');
const timerDisplay = document.getElementById('timerDisplay');
const wpmDisplay = document.getElementById('wpmDisplay');
const keyboard = document.getElementById('keyboard');

// Default text
const defaultText = "Practice typing with this text. Good luck!";
let currentText = defaultText;

// Countdown Timer
let countdown = 0;
let timer = null;
let startTime = null;
let correctChars = 0;
let isTypingSessionActive = false;

// Background Theme Toggle
switchBackgroundBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        switchBackgroundBtn.textContent = 'Switch to Light Mode';
    } else {
        switchBackgroundBtn.textContent = 'Switch to Dark Mode';
    }
});

// Initialize the page with default text and enable typing
window.onload = () => {
    generateText();
    typingInput.disabled = false;
};

function generateText() {
    textToType.innerHTML = formatText(currentText, 0);
}

// Typing Logic
typingInput.addEventListener('input', (e) => {
    const typedText = e.target.value;

    if (!isTypingSessionActive) {
        startCountdown();
        isTypingSessionActive = true;
    }

    checkTyping(typedText);
    handleKeyboardFeedback(e.data);
});

function startCountdown() {
    startTime = new Date();
    countdown = 0;
    timer = setInterval(() => {
        countdown++;
        timerDisplay.textContent = `Time: ${countdown} seconds`;
    }, 1000);
}

// Check Typing
function checkTyping(typedText) {
    const text = currentText;
    let displayedText = '';
    correctChars = 0;

    for (let i = 0; i < text.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === text[i]) {
                displayedText += `<span class="correct">${text[i]}</span>`;
                correctChars++;
            } else {
                displayedText += `<span class="incorrect">${text[i]}</span>`;
            }
        } else {
            displayedText += `<span class="untyped">${text[i]}</span>`;
        }
    }
    textToType.innerHTML = displayedText;

    // Continue typing even if the last character is wrong
    if (typedText.length === text.length && typedText !== text) {
        return;
    }

    // Finish typing
    if (typedText.length === text.length && typedText === text) {
        clearInterval(timer);
        calculateWPM();
        isTypingSessionActive = false;
    }
}

// Calculate WPM
function calculateWPM() {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000 / 60; // Time in minutes
    const wordsTyped = correctChars / 5; // 5 characters = 1 word
    let wpm = Math.round(wordsTyped / timeDiff);
    // Ensure WPM is within reasonable limits
    if (wpm > 1000) {
        wpm = 1000;
    }
    wpmDisplay.textContent = `WPM: ${wpm}`;
}

// Add Custom Text
addTextBtn.addEventListener('click', () => {
    addTextModal.style.display = 'block';
    typingInput.disabled = true;
});

submitCustomText.addEventListener('click', () => {
    const customText = customTextInput.value;
    if (customText) {
        currentText = customText;
        generateText();
    }
    closeModal();
});

cancelCustomText.addEventListener('click', closeModal);

function closeModal() {
    addTextModal.style.display = 'none';
    typingInput.disabled = false;
    customTextInput.value = '';
}

// Virtual Keyboard Feedback
function handleKeyboardFeedback(key) {
    const keyDivs = document.querySelectorAll('.key');
    keyDivs.forEach(div => {
        div.classList.remove('active');
        if (div.textContent.toUpperCase() === key.toUpperCase()) {
            div.classList.add('active');
        }
    });
}

// Format text with color distinction
function formatText(text, typedLength) {
    let formattedText = '';
    for (let i = 0; i < text.length; i++) {
        if (i < typedLength) {
            formattedText += `<span class="correct">${text[i]}</span>`;
        } else {
            formattedText += `<span class="untyped">${text[i]}</span>`;
        }
    }
    return formattedText;
}
