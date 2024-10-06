const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('input-area');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const toggleBgBtn = document.getElementById('toggle-bg');
const customTextBtn = document.getElementById('custom-text');
const generateTextBtn = document.getElementById('generate-text');
const customModal = document.getElementById('custom-modal');
const customInput = document.getElementById('custom-input');
const cancelCustomBtn = document.getElementById('cancel-custom');
const completeCustomBtn = document.getElementById('complete-custom');
const virtualKeyboard = document.getElementById('virtual-keyboard');

let currentText = '';
let timer;
let timeLeft = 60;
let startTime;
let isTyping = false;
let correctChars = 0;

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "The only way to learn a new programming language is by writing programs in it.",
    "Debugging is twice as hard as writing the code in the first place.",
    "First, solve the problem. Then, write the code.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Experience is the name everyone gives to their mistakes.",
    "Knowledge is power."
];

function generateText() {
    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    displayText();
    resetPractice();
}

function displayText() {
    textDisplay.innerHTML = currentText.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('');
}

function startTimer() {
    startTime = new Date();
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        updateWPM();
        if (timeLeft <= 0) {
            clearInterval(timer);
            inputArea.disabled = true;
            alert("Time's up!");
        }
    }, 1000);
}

function updateWPM() {
    const elapsedMinutes = (new Date() - startTime) / 60000;
    const wpm = Math.round((correctChars / 5) / elapsedMinutes);
    wpmDisplay.textContent = `WPM: ${wpm}`;
}

function checkInput() {
    const inputText = inputArea.value;
    const chars = textDisplay.querySelectorAll('.char');
    
    let allCorrect = true;
    correctChars = 0;

    for (let i = 0; i < currentText.length; i++) {
        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                chars[i].className = 'char correct';
                correctChars++;
            } else {
                chars[i].className = 'char incorrect';
                allCorrect = false;
            }
        } else {
            chars[i].className = 'char';
            allCorrect = false;
        }
    }

    if (allCorrect && inputText.length === currentText.length) {
        clearInterval(timer);
        alert("Congratulations! You've completed the text.");
    }
}

inputArea.addEventListener('input', () => {
    if (!isTyping) {
        isTyping = true;
        startTimer();
    }
    checkInput();
});

toggleBgBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

customTextBtn.addEventListener('click', () => {
    customModal.style.display = 'block';
});

cancelCustomBtn.addEventListener('click', () => {
    customModal.style.display = 'none';
});

completeCustomBtn.addEventListener('click', () => {
    const customText = customInput.value.trim();
    if (customText) {
        currentText = customText;
        displayText();
        customModal.style.display = 'none';
        resetPractice();
    } else {
        alert("Please enter some text.");
    }
});

generateTextBtn.addEventListener('click', generateText);

function resetPractice() {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    wpmDisplay.textContent = 'WPM: 0';
    inputArea.value = '';
    inputArea.disabled = false;
    isTyping = false;
    correctChars = 0;
}

function createVirtualKeyboard() {
    const layout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
        ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
    ];

    layout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            keyDiv.textContent = key;
            keyDiv.dataset.key = key.toLowerCase();
            if (key === 'Space') {
                keyDiv.classList.add('space');
                keyDiv.dataset.key = ' ';
            }
            rowDiv.appendChild(keyDiv);
        });
        virtualKeyboard.appendChild(rowDiv);
    });
}

function highlightKey(key) {
    const keyElement = virtualKeyboard.querySelector(`[data-key="${key.toLowerCase()}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 100);
    }
}

document.addEventListener('keydown', (e) => {
    highlightKey(e.key);
});

createVirtualKeyboard();
generateText();