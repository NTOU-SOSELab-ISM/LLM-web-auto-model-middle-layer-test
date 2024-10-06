// 獲取 DOM 元素
const countdownElement = document.getElementById('countdown');
const inputTextElement = document.getElementById('inputText');
const generatedTextElement = document.getElementById('generatedText');
const errorsElement = document.getElementById('errors');
const wpmElement = document.getElementById('wpm');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const toggleThemeButton = document.getElementById('toggle-theme');
const addTextModal = document.getElementById('addTextModal');
const newTextInput = document.getElementById('newTextInput');
const confirmAddTextButton = document.getElementById('confirmAddText');
const cancelAddTextButton = document.getElementById('cancelAddText');
const addTextBtn = document.getElementById('addTextBtn');
const completionTimeElement = document.getElementById('completionTime');
const completionMessage = document.getElementById('completionMessage');
const generateTextBtn = document.getElementById('generateTextBtn');

// 初始化變數
let timeLeft = 60;
let timerInterval;
let totalErrors = 0;
let wordCount = 0;
let currentText = 'The quick brown fox jumps over the lazy dog.';
let isDarkTheme = false;
let startTime = null;

// 設置初始文本
generatedTextElement.textContent = currentText;

// 開始計時
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            inputTextElement.disabled = true;
            calculateWPM();
        }
    }, 1000);
}

// 切換背景主題
toggleThemeButton.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-mode');
});

// 添加文本功能
addTextBtn.addEventListener('click', () => {
    addTextModal.style.display = 'flex';
});

// 確認添加文本
confirmAddTextButton.addEventListener('click', () => {
    let newText = newTextInput.value.trim();
    if (newText) {
        currentText = newText;
        generatedTextElement.textContent = currentText;
        resetTest();
    }
    addTextModal.style.display = 'none';
});

// 取消添加文本
cancelAddTextButton.addEventListener('click', () => {
    addTextModal.style.display = 'none';
});

// 隨機產生文本
generateTextBtn.addEventListener('click', () => {
    const randomTexts = [
        'The quick brown fox jumps over the lazy dog.',
        'Lorem ipsum dolor sit amet.',
        'Hello world, welcome to typing practice.',
        'This is a test of the emergency broadcast system.',
        'Typing is fun and improves your skills.'
    ];
    const randomIndex = Math.floor(Math.random() * randomTexts.length);
    currentText = randomTexts[randomIndex];
    generatedTextElement.textContent = currentText;
    resetTest();
});

// 開始輸入時觸發計時
inputTextElement.addEventListener('input', function() {
    if (!startTime) {
        startTime = new Date();
        startTimer();
    }
    
    let typedText = inputTextElement.value;
    let isCorrect = true;
    let textDisplay = '';
    let currentErrors = 0; // 當前輸入錯誤數

    // 驗證輸入並即時反饋
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                textDisplay += `<span class="correct">${currentText[i]}</span>`;
            } else {
                textDisplay += `<span class="incorrect">${currentText[i]}</span>`;
                isCorrect = false;
                currentErrors++;
            }
        } else {
            textDisplay += currentText[i];
            isCorrect = false;
        }
    }

    generatedTextElement.innerHTML = textDisplay;
    errorsElement.textContent = totalErrors + currentErrors;

    // 完成文本
    if (isCorrect && typedText.length === currentText.length) {
        clearInterval(timerInterval);
        calculateWPM();
        calculateCompletionTime();
        showCompletionMessage();
    }
});

// 重置測驗
function resetTest() {
    inputTextElement.value = '';
    totalErrors = 0;
    errorsElement.textContent = totalErrors;
    completionMessage.style.display = 'none';
    timeLeft = 60;
    countdownElement.textContent = timeLeft;
    inputTextElement.disabled = false;
    startTime = null;
    clearInterval(timerInterval);
}

// 計算 WPM
function calculateWPM() {
    let timeSpent = (60 - timeLeft) / 60; // 分鐘數
    let wordsTyped = inputTextElement.value.trim().split(/\s+/).length;
    let wpm = Math.round(wordsTyped / timeSpent);
    wpmElement.textContent = wpm > 0 ? wpm : 0;
}

// 計算完成時間
function calculateCompletionTime() {
    let endTime = new Date();
    let totalTime = (endTime - startTime) / 1000; // 秒數
    completionTimeElement.textContent = Math.round(totalTime);
}

// 顯示完成提示
function showCompletionMessage() {
    completionMessage.style.display = 'block';
    setTimeout(() => {
        completionMessage.style.display = 'none';
    }, 5000);  // 5 秒後自動隱藏
}

// 初始化鍵盤顯示
function createKeyboard() {
    const keyLayout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
        ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
        ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
        ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
    ];

    keyLayout.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('keyboard-row');

        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.textContent = key;

            // 添加特殊按鍵類別
            if (key === 'Backspace' || key === 'Tab' || key === 'CapsLock' || key === 'Enter' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu') {
                keyElement.classList.add('wide');
            } else if (key === 'Space') {
                keyElement.classList.add('space');
            }

            keyElement.classList.add('key');
            rowElement.appendChild(keyElement);
        });

        virtualKeyboard.appendChild(rowElement);
    });
}

// 按鍵點亮效果
document.addEventListener('keydown', function(event) {
    let key = event.key;
    
    // 特殊鍵處理
    if (key === ' ') {
        key = 'Space';
    } else if (key === 'Backspace') {
        key = 'Backspace';
    } else if (key === 'Tab') {
        key = 'Tab';
    } else if (key === 'CapsLock') {
        key = 'CapsLock';
    } else if (key === 'Enter') {
        key = 'Enter';
    } else if (key === 'Shift') {
        key = 'Shift';
    } else if (key === 'Control') {
        key = 'Ctrl';
    } else if (key === 'Alt') {
        key = 'Alt';
    } else if (key === 'ContextMenu') {
        key = 'Menu';
    } else {
        key = key.toUpperCase();
    }

    let keyElements = document.querySelectorAll('.keyboard .key');
    keyElements.forEach(keyElement => {
        if (keyElement.textContent === key) {
            keyElement.classList.add('key-active');
        }
    });
});

document.addEventListener('keyup', function(event) {
    let key = event.key;
    
    // 特殊鍵處理
    if (key === ' ') {
        key = 'Space';
    } else if (key === 'Backspace') {
        key = 'Backspace';
    } else if (key === 'Tab') {
        key = 'Tab';
    } else if (key === 'CapsLock') {
        key = 'CapsLock';
    } else if (key === 'Enter') {
        key = 'Enter';
    } else if (key === 'Shift') {
        key = 'Shift';
    } else if (key === 'Control') {
        key = 'Ctrl';
    } else if (key === 'Alt') {
        key = 'Alt';
    } else if (key === 'ContextMenu') {
        key = 'Menu';
    } else {
        key = key.toUpperCase();
    }

    let keyElements = document.querySelectorAll('.keyboard .key');
    keyElements.forEach(keyElement => {
        if (keyElement.textContent === key) {
            keyElement.classList.remove('key-active');
        }
    });
});

// 初始化鍵盤
createKeyboard();
