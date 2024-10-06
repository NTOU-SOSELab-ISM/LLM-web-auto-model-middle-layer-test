// DOM elements
const themeToggle = document.getElementById('themeToggle');
const timerElement = document.getElementById('timer').querySelector('span');
const wpmElement = document.getElementById('wpm').querySelector('span');
const inputArea = document.getElementById('inputArea');
const textDisplay = document.getElementById('textDisplay');
const addTextBtn = document.getElementById('addTextBtn');
const generateTextBtn = document.getElementById('generateText');
const keyboard = document.getElementById('keyboard');
const textModal = document.getElementById('textModal');
const customText = document.getElementById('customText');
const submitText = document.getElementById('submitText');
const cancelText = document.getElementById('cancelText');

// Variables
let currentText = '';
let typedText = '';
let startTime;
let timerInterval;
let timeLeft = 60;

// Sample texts
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz."
];

// Keyboard layout
const keyboardLayout = [
    [
        { key: '`', class: 'key-default' },
        { key: '1', class: 'key-default' },
        { key: '2', class: 'key-default' },
        { key: '3', class: 'key-default' },
        { key: '4', class: 'key-default' },
        { key: '5', class: 'key-default' },
        { key: '6', class: 'key-default' },
        { key: '7', class: 'key-default' },
        { key: '8', class: 'key-default' },
        { key: '9', class: 'key-default' },
        { key: '0', class: 'key-default' },
        { key: '-', class: 'key-default' },
        { key: '=', class: 'key-default' },
        { key: 'Backspace', class: 'key-backspace' }
    ],
    [
        { key: 'Tab', class: 'key-tab' },
        { key: 'Q', class: 'key-default' },
        { key: 'W', class: 'key-default' },
        { key: 'E', class: 'key-default' },
        { key: 'R', class: 'key-default' },
        { key: 'T', class: 'key-default' },
        { key: 'Y', class: 'key-default' },
        { key: 'U', class: 'key-default' },
        { key: 'I', class: 'key-default' },
        { key: 'O', class: 'key-default' },
        { key: 'P', class: 'key-default' },
        { key: '[', class: 'key-default' },
        { key: ']', class: 'key-default' },
        { key: '\\', class: 'key-backslash' }
    ],
    [
        { key: 'Caps Lock', class: 'key-capslock' },
        { key: 'A', class: 'key-default' },
        { key: 'S', class: 'key-default' },
        { key: 'D', class: 'key-default' },
        { key: 'F', class: 'key-default' },
        { key: 'G', class: 'key-default' },
        { key: 'H', class: 'key-default' },
        { key: 'J', class: 'key-default' },
        { key: 'K', class: 'key-default' },
        { key: 'L', class: 'key-default' },
        { key: ';', class: 'key-default' },
        { key: "'", class: 'key-default' },
        { key: 'Enter', class: 'key-enter' }
    ],
    [
        { key: 'Shift', class: 'key-shift-left' },
        { key: 'Z', class: 'key-default' },
        { key: 'X', class: 'key-default' },
        { key: 'C', class: 'key-default' },
        { key: 'V', class: 'key-default' },
        { key: 'B', class: 'key-default' },
        { key: 'N', class: 'key-default' },
        { key: 'M', class: 'key-default' },
        { key: ',', class: 'key-default' },
        { key: '.', class: 'key-default' },
        { key: '/', class: 'key-default' },
        { key: 'Shift', class: 'key-shift-right' }
    ],
    [
        { key: 'Ctrl', class: 'key-wide' },
        { key: 'Win', class: 'key-wide' },
        { key: 'Alt', class: 'key-wide' },
        { key: 'Space', class: 'key-space' },
        { key: 'Alt', class: 'key-wide' },
        { key: 'Win', class: 'key-wide' },
        { key: 'Menu', class: 'key-wide' },
        { key: 'Ctrl', class: 'key-wide' }
    ]
];

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Generate virtual keyboard
function generateKeyboard() {
    keyboard.innerHTML = '';
    keyboardLayout.forEach((row) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach((keyObj) => {
            const keyDiv = document.createElement('div');
            keyDiv.className = `key ${keyObj.class}`;
            keyDiv.textContent = keyObj.key;
            rowDiv.appendChild(keyDiv);
        });
        keyboard.appendChild(rowDiv);
    });
}

// Generate new text
function generateNewText() {
    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textDisplay.textContent = currentText;
    typedText = '';
    inputArea.value = '';
    resetTimer();
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    wpmElement.textContent = '0';
    inputArea.disabled = false;
    startTime = null;
}

// Start timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    inputArea.disabled = true;
    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000 / 60; // in minutes
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / totalTime);
    wpmElement.textContent = wpm;
}

// Update text display
function updateTextDisplay() {
    let displayText = '';
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                displayText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                displayText += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else {
            displayText += currentText[i];
        }
    }
    textDisplay.innerHTML = displayText;
}

// Handle input
inputArea.addEventListener('input', (e) => {
    if (!startTime) {
        startTimer();
    }
    typedText = e.target.value;
    updateTextDisplay();
    updateKeyboard(e.inputType === 'deleteContentBackward' ? 'Backspace' : e.data);
    if (typedText === currentText) {
        endGame();
    }
});

// Update keyboard
function updateKeyboard(key) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(keyElement => {
        if (key === ' ' && keyElement.textContent === 'Space') {
            keyElement.classList.add('active');
            setTimeout(() => keyElement.classList.remove('active'), 100);
        } else if (keyElement.textContent.toLowerCase() === key.toLowerCase()) {
            keyElement.classList.add('active');
            setTimeout(() => keyElement.classList.remove('active'), 100);
        }
    });
}

// Add custom text
addTextBtn.addEventListener('click', () => {
    textModal.style.display = 'block';
});

submitText.addEventListener('click', () => {
    if (customText.value.trim() !== '') {
        currentText = customText.value.trim();
        textDisplay.textContent = currentText;
        typedText = '';
        inputArea.value = '';
        textModal.style.display = 'none';
        resetTimer();
    }
});

cancelText.addEventListener('click', () => {
    textModal.style.display = 'none';
});

// Generate new text button event listener
generateTextBtn.addEventListener('click', generateNewText);

// Initialize
generateKeyboard();
generateNewText();