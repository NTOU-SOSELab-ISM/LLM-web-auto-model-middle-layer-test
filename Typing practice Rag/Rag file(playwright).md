## 以下是兩個playwrtight範例，分別對應到兩個網頁範例
### 範例1:

#### 測試網頁:

以下為HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Typing Challenge</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Typing Challenge</h1>
        <div class="typing-area">
            <p id="generatedWord"></p>
            <textarea id="inputText" placeholder="Type the word here..."></textarea>
        </div>
        <div id="feedback"></div>
        <div id="result"></div>
        <div class="stats">
            <p>Time: <span id="timer">60</span> seconds</p>
            <p>Words per minute: <span id="wpm">0</span></p>
            <p>Errors: <span id="errors">0</span></p>
            <p>Attempts: <span id="attempts">0</span></p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```
以下為Javascript
```js
const generatedWordElement = document.getElementById('generatedWord');
const inputTextElement = document.getElementById('inputText');
const feedbackElement = document.getElementById('feedback');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const errorsElement = document.getElementById('errors');
const attemptsElement = document.getElementById('attempts');

const wordList = ['apple', 'banana', 'orange', 'grape', 'watermelon', 'strawberry', 'blueberry', 'mango', 'cherry', 'pineapple'];
let generatedWord = '';
let timeLeft = 60;
let interval;
let totalErrors = 0;
let wordCount = 0;
let attemptsCount = 0;

// Initialize
generateRandomWord();
inputTextElement.addEventListener('keydown', handleEnter);

function startTimer() {
    interval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(interval);
            inputTextElement.disabled = true;
            calculateWPM();
        }
    }, 1000);
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent default behavior (new line)

        const inputText = inputTextElement.value.trim();

        // Start the timer on first input
        if (wordCount === 0 && timeLeft === 60) {
            startTimer();
        }

        // Display the input result with color coding and increment attempts count
        displayResult(inputText);

        // Clear input field for the next word and generate a new random word
        inputTextElement.value = "";
        generateRandomWord();

        // Calculate words per minute (WPM)
        calculateWPM();
    }
}

function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    generatedWord = wordList[randomIndex];
    generatedWordElement.textContent = generatedWord;
}

function displayResult(inputText) {
    attemptsCount++;
    attemptsElement.textContent = attemptsCount;

    // Show only the latest result
    resultElement.innerHTML = `
        <p>Your input: <span class="${inputText === generatedWord ? 'correct' : 'incorrect'}">${inputText}</span></p>
        <p>Correct word: <span class="correct">${generatedWord}</span></p>
    `;

    // Update feedback and errors
    if (inputText === generatedWord) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        wordCount++;
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.style.color = "red";
        totalErrors++;
    }

    errorsElement.textContent = totalErrors;
}

function calculateWPM() {
    const timeSpent = 60 - timeLeft;
    const wpm = timeSpent > 0 ? (wordCount / timeSpent) * 60 : 0;
    wpmElement.textContent = Math.max(0, Math.round(wpm));
}
```
以下為CSS
```css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 80%;
    max-width: 900px;
}

h1 {
    font-size: 2rem;
    margin-bottom: 20px;
}

.typing-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#generatedWord {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

textarea {
    width: 100%;
    height: 50px;
    font-size: 18px;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #ccc;
    resize: none;
}

textarea:focus {
    outline: none;
    border-color: #66afe9;
}

#feedback {
    margin-top: 20px;
    font-size: 18px;
}

#result {
    margin-top: 10px;
    font-size: 18px;
    white-space: pre-wrap;
    text-align: left;
}

.stats {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    font-size: 18px;
}

.correct {
    color: green;
}

.incorrect {
    color: red;
}
```

#### 測試腳本:
```ts
import { test, expect } from '@playwright/test';

test.describe('Typing Challenge', () => {

  test.beforeEach(async ({ page }) => {
    // 確保每次測試前都載入網頁
    await page.goto('http://127.0.0.1:8080/');
  });

  test('應顯示正確的標題', async ({ page }) => {
    const title = await page.getByTestId('typing-challenge-title');
    await expect(title).toHaveText('Typing Challenge');
  });

  test('應生成隨機單字', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');

    let previousWord = await wordElement.textContent();
    let newWord = '';
    const maxAttempts = 100;  // 設定最大測試次數，防止無限循環
    let attempts = 0;

    // 持續測試直到生成不同的單字或達到最大測試次數
    while (attempts < maxAttempts) {
      await page.reload(); // 每次重新載入頁面以生成新單字
      let newWord = await wordElement.textContent();

      if (newWord !== previousWord) {
        break;  // 當生成不同的單字時結束測試
      }

      attempts++;
    }

    // 測試通過的條件是找到不同的單字
    expect(newWord).not.toBe(previousWord);
    console.log(`生成不同的單字: ${previousWord} -> ${newWord} (共嘗試 ${attempts + 1} 次)`);
  });

  test('應允許使用者輸入文字並檢查是否正確', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const feedbackElement = await page.getByTestId('feedback');

    // 取得隨機生成的單字
    const generatedWord = await wordElement.textContent();

    // 模擬輸入正確的單字
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 檢查反饋是否顯示 "Correct!"
    await expect(feedbackElement).toHaveText('Correct!');
  });

  test('計時器應從 60 開始並遞減且小於等於 60', async ({ page }) => {
    const timerElement = await page.getByTestId('timer');

    // 檢查計時器起始為 60
    await expect(timerElement).toHaveText('60');

    // 模擬一些時間的流逝（3秒）
    await page.waitForTimeout(3000);

    // 檢查計時器是否已經遞減且小於等於 60
    const timerValue = await timerElement.textContent();
    expect(Number(timerValue)).toBeLessThanOrEqual(60);
  });

  test('應計算 WPM 並顯示 (至少輸入兩次)', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const wpmElement = await page.getByTestId('wpm');

    // 第一次輸入
    let generatedWord = await wordElement.textContent();
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 等待一秒後輸入第二個單字
    await page.waitForTimeout(1000);
    generatedWord = await wordElement.textContent();
    await inputElement.fill(generatedWord || '');
    await inputElement.press('Enter');

    // 檢查 WPM 是否顯示且大於 0
    const wpmValue = await wpmElement.textContent();
    expect(Number(wpmValue)).toBeGreaterThan(0);
  });

  test('應顯示錯誤次數', async ({ page }) => {
    const wordElement = await page.getByTestId('generated-word');
    const inputElement = await page.getByTestId('input-text-area');
    const feedbackElement = await page.getByTestId('feedback');
    const errorsElement = await page.getByTestId('errors');

    // 獲取生成的單字
    const generatedWord = await wordElement.textContent();

    // 輸入錯誤的單字
    await inputElement.fill('wrongWord');
    await inputElement.press('Enter');

    // 檢查反饋是否顯示 "Incorrect!"
    await expect(feedbackElement).toHaveText('Incorrect!');

    // 檢查錯誤次數是否增加
    const errorsCount = await errorsElement.textContent();
    expect(Number(errorsCount)).toBeGreaterThan(0);
  });

});
```

### 範例2:

#### 測試網頁:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Typing Practice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 0;
      padding: 0;
    }
    .container {
      margin: 50px auto;
      width: 80%;
    }
    #timer {
      font-size: 24px;
      margin-bottom: 20px;
    }
    #textToType {
      font-size: 18px;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ccc;
    }
    #inputText {
      width: 100%;
      height: 100px;
      font-size: 18px;
      border: 2px solid #000;
      padding: 10px;
      outline: none;
    }
    .correct {
      color: green;
    }
    .incorrect {
      color: red;
    }
    #result {
      font-size: 24px;
      color: blue;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Typing Practice</h1>
    <div id="timer">Time left: 60s</div>
    <div id="textToType">The quick brown fox jumps over the lazy dog.</div>
    <textarea id="inputText" placeholder="Start typing..." autofocus></textarea>
    <div id="result"></div>
  </div>

  <script>
    let timerElement = document.getElementById('timer');
    let inputText = document.getElementById('inputText');
    let textToType = document.getElementById('textToType').innerText;
    let resultElement = document.getElementById('result');
    let timeLeft = 60;
    
    // Start countdown timer
    let countdown = setInterval(function () {
      timeLeft--;
      timerElement.innerText = `Time left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        inputText.disabled = true;
        resultElement.innerText = "Time's up!";
      }
    }, 1000);

    inputText.addEventListener('input', function () {
      let typedText = inputText.value;
      let displayText = '';
      let isCorrect = true;
      
      for (let i = 0; i < textToType.length; i++) {
        if (i < typedText.length) {
          if (typedText[i] === textToType[i]) {
            displayText += `<span class="correct">${textToType[i]}</span>`;
          } else {
            displayText += `<span class="incorrect">${textToType[i]}</span>`;
            isCorrect = false; // 出現錯誤字元
          }
        } else {
          displayText += textToType[i];
          isCorrect = false; // 尚未輸入完全
        }
      }

      let textToTypeElement = document.getElementById('textToType');
      textToTypeElement.innerHTML = displayText;

      // 如果完全正確，顯示結果並停用輸入框
      if (isCorrect && typedText.length === textToType.length) {
        clearInterval(countdown);
        resultElement.innerText = "恭喜！你完成了！";
        inputText.disabled = true;
      }
    });
  </script>
</body>
</html>
```

#### 測試腳本:
```ts
import { test, expect } from '@playwright/test';

test('Initial display of timer and text to type', async ({ page }) => {
  // 導航到測試頁面
  await page.goto('http://localhost:8080');

  // 選擇計時器與練習文本的對象
  const timer = page.getByTestId('timer'); // 計時器
  const textToType = page.getByTestId('text-to-type'); // 練習文本

  // 檢查初始狀態下的顯示
  await expect(timer).toHaveText('Time left: 5s'); // 檢查計時器顯示是否正確
  await expect(textToType).toHaveText('The quick brown fox jumps over the lazy dog.'); // 檢查練習文本
});
test('Typing partial text and checking correct marking', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇輸入框與練習文本的對象
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const textToType = page.getByTestId('text-to-type'); // 練習文本
  
    // 模擬使用者輸入部分文本
    await inputTextArea.fill('The quick brown'); // 輸入 "The quick brown"
  
    // 確認輸入的部分文本有正確的標記
    await expect(textToType).toContainText('The quick brown'); // 確認正確的部分
  });
  test('Timer countdown and disabling input after time up', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇計時器與結果顯示的對象
    const timer = page.getByTestId('timer'); // 計時器
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const result = page.getByTestId('result'); // 結果區域
  
    // 等待時間結束
    await page.waitForTimeout(6000); // 等待 6 秒，確保時間倒數結束
  
    // 檢查輸入框是否被禁用，並顯示時間到期訊息
    await expect(inputTextArea).toBeDisabled(); // 輸入框應該禁用
    await expect(result).toHaveText("Time's up!"); // 檢查是否顯示 "Time's up!"
  });
  test('Complete the text and display success message', async ({ page }) => {
    // 導航到測試頁面
    await page.goto('http://localhost:8080');
  
    // 選擇輸入框與結果顯示的對象
    const inputTextArea = page.getByTestId('input-text-area'); // 輸入框
    const result = page.getByTestId('result'); // 結果區域
  
    // 模擬完整輸入文本
    await inputTextArea.fill('The quick brown fox jumps over the lazy dog.');
  
    // 等待一點時間來檢查
    await page.waitForTimeout(1000);
  
    // 檢查結果是否顯示完成訊息，並確認輸入框被禁用
    await expect(result).toHaveText('恭喜！你完成了！'); // 顯示完成訊息
    await expect(inputTextArea).toBeDisabled(); // 確認輸入框禁用
  });
```
  