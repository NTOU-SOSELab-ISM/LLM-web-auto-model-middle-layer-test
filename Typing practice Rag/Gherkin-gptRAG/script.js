const textToTypeElement = document.getElementById('textToType');
const inputTextElement = document.getElementById('inputText');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const modal = document.getElementById('customTextModal');
const customTextInput = document.getElementById('customTextInput');
let interval;
let timeLeft = 60;
let wordCount = 0;
let generatedText = "";
let isTypingComplete = false;

// 生成虛擬鍵盤
const keyLayout = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];

keyLayout.forEach(row => {
    row.split('').forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.innerText = key;
        virtualKeyboard.appendChild(keyElement);
    });
    const breakElement = document.createElement('div');
    breakElement.style.gridColumn = "span 10";  // 模擬換行
    virtualKeyboard.appendChild(breakElement);
});

// 切換背景主題
document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    modal.classList.toggle('dark');
});

// 按鍵高亮顯示
inputTextElement.addEventListener('keydown', (event) => {
    highlightKey(event.key);
});

// 處理輸入並即時顯示比對結果
inputTextElement.addEventListener('input', () => {
    const typedText = inputTextElement.value;
    let feedbackText = '';
    isTypingComplete = true;
    
    for (let i = 0; i < generatedText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === generatedText[i]) {
                feedbackText += `<span class="correct">${generatedText[i]}</span>`;
            } else {
                feedbackText += `<span class="incorrect">${generatedText[i]}</span>`;
                isTypingComplete = false;  // 有錯誤則視為未完成
            }
        } else {
            feedbackText += generatedText[i];
            isTypingComplete = false;  // 尚未輸入完成
        }
    }
    textToTypeElement.innerHTML = feedbackText;

    // 停止計時並計算WPM
    if (isTypingComplete) {
        clearInterval(interval);
        calculateWPM();
        inputTextElement.disabled = true;
    }
});

// 高亮虛擬鍵盤按鍵
function highlightKey(key) {
    const keyElement = [...virtualKeyboard.children].find(k => k.innerText.toLowerCase() === key.toLowerCase());
    if (keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => {
            keyElement.classList.remove('pressed');
        }, 200);
    }
}

// 生成隨機文本
document.getElementById('generateText').addEventListener('click', () => {
    const texts = ['The quick brown fox jumps over the lazy dog.', 'Hello world!', 'Practice makes perfect.'];
    generatedText = texts[Math.floor(Math.random() * texts.length)];
    textToTypeElement.innerHTML = generatedText;
    inputTextElement.value = '';
    reset();
});

// 添加自訂文本
document.getElementById('submitCustomText').addEventListener('click', () => {
    generatedText = customTextInput.value;
    textToTypeElement.innerHTML = generatedText;
    inputTextElement.value = '';
    document.getElementById('customTextModal').style.display = 'none';
    reset();
});

// 開啟自訂文本模態框
document
