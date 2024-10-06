const elements = {
    backgroundToggle: document.getElementById('background-toggle'),
    difficultySelector: document.getElementById('difficulty-selector'),
    lengthSelector: document.getElementById('length-selector'),
    timer: document.getElementById('timer'),
    wpmDisplay: document.getElementById('wpm'),
    accuracyDisplay: document.getElementById('accuracy'),
    inputBox: document.getElementById('input-box'),
    textDisplay: document.getElementById('text-display'),
    virtualKeyboard: document.getElementById('virtual-keyboard'),
    results: document.getElementById('results'),
    closeResults: document.getElementById('close-results'),
    keySound: document.getElementById('keySound')
};

let state = {
    startTime: null,
    timerInterval: null,
    currentText: '',
    currentIndex: 0,
    errors: 0,
    totalKeystrokes: 0,
    shiftPressed: false
};

const colors = {
    light: {
        background: '#f0f0f0',
        text: '#333',
        correct: '#27ae60',
        incorrect: '#e74c3c',
        pending: '#7f8c8d'
    },
    dark: {
        background: '#2c3e50',
        text: '#ecf0f1',
        correct: '#2ecc71',
        incorrect: '#e74c3c',
        pending: '#bdc3c7'
    }
};

const textLengths = { short: 50, medium: 100, long: 200 };

const difficulties = {
    easy: { minLength: 3, maxLength: 5, punctuationChance: 0.1 },
    medium: { minLength: 4, maxLength: 8, punctuationChance: 0.2 },
    hard: { minLength: 6, maxLength: 12, punctuationChance: 0.3 }
};

const punctuation = ',.?!:;"\'(){}[]';
const words = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'];

function toggleBackground() {
    const isDark = document.body.classList.toggle('dark');
    const mode = isDark ? 'dark' : 'light';
    document.body.style.backgroundColor = colors[mode].background;
    document.body.style.color = colors[mode].text;
    updateTextColors();
    updateUIColors(mode);
}

function updateUIColors(mode) {
    elements.inputBox.style.borderColor = colors[mode].text;
    elements.textDisplay.style.borderColor = colors[mode].text;
    document.querySelectorAll('.key').forEach(key => {
        key.style.borderColor = colors[mode].text;
        key.style.color = colors[mode].text;
    });
    document.querySelectorAll('button, select').forEach(elem => {
        elem.style.backgroundColor = colors[mode].text;
        elem.style.color = colors[mode].background;
    });
}

function updateTextColors() {
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    const spans = elements.textDisplay.getElementsByTagName('span');
    for (let i = 0; i < spans.length; i++) {
        if (i < state.currentIndex) {
            spans[i].style.color = spans[i].style.color === colors[mode].incorrect ? colors[mode].incorrect : colors[mode].correct;
        } else {
            spans[i].style.color = colors[mode].pending;
        }
    }
}

function generateText() {
    const difficulty = difficulties[elements.difficultySelector.value];
    const length = textLengths[elements.lengthSelector.value];
    let text = [];
    while (text.join(' ').length < length) {
        let word = words[Math.floor(Math.random() * words.length)];
        if (Math.random() < difficulty.punctuationChance) {
            word += punctuation[Math.floor(Math.random() * punctuation.length)];
        }
        text.push(word);
    }
    state.currentText = text.join(' ');
    displayText();
}

function displayText() {
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    elements.textDisplay.innerHTML = state.currentText.split('').map(char => 
        `<span style="color: ${colors[mode].pending};">${char}</span>`
    ).join('');
}

function updateText(index, correct) {
    const spans = elements.textDisplay.getElementsByTagName('span');
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    spans[index].style.color = correct ? colors[mode].correct : colors[mode].incorrect;
}

function startTimer() {
    state.startTime = new Date();
    state.timerInterval = setInterval(updateStats, 1000);
}

function updateStats() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - state.startTime);
    const minutes = elapsedTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getUTCSeconds().toString().padStart(2, '0');
    elements.timer.textContent = `時間: ${minutes}:${seconds}`;

    const elapsedMinutes = elapsedTime / 60000;
    const words = state.currentIndex / 5;
    const wpm = Math.round(words / elapsedMinutes);
    elements.wpmDisplay.textContent = `WPM: ${wpm}`;

    const accuracy = Math.round((state.totalKeystrokes - state.errors) / state.totalKeystrokes * 100) || 100;
    elements.accuracyDisplay.textContent = `準確率: ${accuracy}%`;
}

function showResults() {
    const endTime = new Date();
    const elapsedTime = (endTime - state.startTime) / 1000 / 60; // in minutes
    const wordsTyped = state.currentText.split(' ').length;
    const wpm = Math.round(wordsTyped / elapsedTime);
    const accuracy = Math.round((state.totalKeystrokes - state.errors) / state.totalKeystrokes * 100) || 100;
    const errorsPerMinute = Math.round(state.errors / elapsedTime);

    document.getElementById('result-time').textContent = `完成時間: ${elements.timer.textContent.split(': ')[1]}`;
    document.getElementById('result-words').textContent = `總字數: ${wordsTyped}`;
    document.getElementById('result-wpm').textContent = `WPM: ${wpm}`;
    document.getElementById('result-accuracy').textContent = `準確率: ${accuracy}%`;
    document.getElementById('result-errors').textContent = `每分鐘錯誤數: ${errorsPerMinute}`;

    elements.results.style.display = 'block';
}

function createVirtualKeyboard() {
    const keys = 'qwertyuiopasdfghjklzxcvbnm' + punctuation;
    keys.split('').forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.className = 'key';
        keyElement.textContent = key;
        keyElement.setAttribute('aria-label', `鍵盤按鍵 ${key}`);
        keyElement.setAttribute('data-testid', `key-${key}`);
        elements.virtualKeyboard.appendChild(keyElement);
    });
}

function highlightKey(key) {
    const keyElement = Array.from(elements.virtualKeyboard.children).find(el => el.textContent === key.toLowerCase());
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 100);
    }
}

elements.inputBox.addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        state.shiftPressed = true;
        return;
    }

    if (state.currentIndex === 0) startTimer();
    highlightKey(e.key);
    elements.keySound.currentTime = 0;
    elements.keySound.play();

    if (e.key === state.currentText[state.currentIndex]) {
        updateText(state.currentIndex, true);
        state.currentIndex++;
    } else {
        updateText(state.currentIndex, false);
        if (!state.shiftPressed) {
            state.errors++;
        }
    }

    if (!state.shiftPressed) {
        state.totalKeystrokes++;
    }

    if (state.currentIndex === state.currentText.length) {
        clearInterval(state.timerInterval);
        showResults();
    }
});

elements.inputBox.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        state.shiftPressed = false;
    }
});

elements.backgroundToggle.addEventListener('click', toggleBackground);
elements.difficultySelector.addEventListener('change', generateText);
elements.lengthSelector.addEventListener('change', generateText);
elements.closeResults.addEventListener('click', function() {
    elements.results.style.display = 'none';
    resetState();
    generateText();
});

function resetState() {
    state = {
        startTime: null,
        timerInterval: null,
        currentText: '',
        currentIndex: 0,
        errors: 0,
        totalKeystrokes: 0,
        shiftPressed: false
    };
    elements.timer.textContent = '時間: 00:00';
    elements.wpmDisplay.textContent = 'WPM: 0';
    elements.accuracyDisplay.textContent = '準確率: 100%';
    elements.inputBox.value = '';
}

function init() {
    createVirtualKeyboard();
    generateText();
    elements.inputBox.focus();
}

init();