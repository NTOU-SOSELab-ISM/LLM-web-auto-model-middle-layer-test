const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const textToType = document.getElementById('text-to-type');
const typingArea = document.getElementById('typing-area');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const keyboard = document.getElementById('keyboard');
const addTextBtn = document.getElementById('add-text-btn');
const generateTextBtn = document.getElementById('generate-text-btn');
const customTextModal = document.getElementById('custom-text-modal');
const customTextInput = document.getElementById('custom-text-input');
const saveTextBtn = document.getElementById('save-text-btn');
const cancelBtn = document.getElementById('cancel-btn');

let defaultTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect.",
    "Typing is a skill that requires practice.",
    "Hello world!",
    "JavaScript is fun to learn."
];

let typingText = "";
let timeLeft = 60;
let timerStarted = false;
let interval;
let charsTyped = 0;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = 'Switch to Light Mode';
    } else {
        themeToggle.textContent = 'Switch to Dark Mode';
    }
});

function startTypingTest() {
    typingArea.disabled = false;
    typingArea.value = '';
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    charsTyped = 0;
    typingArea.focus();
    wpmDisplay.textContent = 0;
    timerStarted = false;
    clearInterval(interval);
}

generateTextBtn.addEventListener('click', () => {
    typingText = defaultTexts[Math.floor(Math.random() * defaultTexts.length)];
    textToType.textContent = typingText;
    startTypingTest();
});

typingArea.addEventListener('input', () => {
    if (!timerStarted) {
        timerStarted = true;
        interval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                typingArea.disabled = true;
                calculateWPM();
            }
        }, 1000);
    }
    const typedText = typingArea.value;
    charsTyped = typedText.length;
    updateTextDisplay(typedText);
    if (typedText === typingText) {
        clearInterval(interval);
        typingArea.disabled = true;
        calculateWPM();
    }
});

function updateTextDisplay(typedText) {
    let newHTML = '';
    for (let i = 0; i < typingText.length; i++) {
        if (typedText[i] == null) {
            newHTML += `<span class="pending">${typingText[i]}</span>`;
        } else if (typedText[i] === typingText[i]) {
            newHTML += `<span class="correct">${typingText[i]}</span>`;
        } else {
            newHTML += `<span class="incorrect">${typingText[i]}</span>`;
        }
    }
    textToType.innerHTML = newHTML;
}

function calculateWPM() {
    let timeSpent = (60 - timeLeft) / 60;
    let wordsTyped = charsTyped / 5;
    let wpm = Math.round(wordsTyped / timeSpent);
    wpmDisplay.textContent = wpm;
}

addTextBtn.addEventListener('click', () => {
    customTextModal.style.display = 'flex';
});

saveTextBtn.addEventListener('click', () => {
    typingText = customTextInput.value.trim() || defaultTexts[0];
    textToType.textContent = typingText;
    customTextInput.value = '';
    customTextModal.style.display = 'none';
    startTypingTest();
});

cancelBtn.addEventListener('click', () => {
    customTextModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === customTextModal) {
        customTextModal.style.display = 'none';
    }
});

// 虛擬鍵盤按鍵排版
const keys = [
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
    'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
    'Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
    'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift',
    'Space'
];

keys.forEach(key => {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key');
    keyElement.textContent = key;
    keyElement.dataset.key = key;  // For special keys handling
    keyboard.appendChild(keyElement);
});

typingArea.addEventListener('keydown', (e) => {
    const keyPressed = e.key;
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(key => {
        if (key.dataset.key === keyPressed || (key.dataset.key === 'Space' && keyPressed === ' ')) {
            key.classList.add('active');
        }
    });
});

typingArea.addEventListener('keyup', () => {
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(key => {
        key.classList.remove('active');
    });
});
