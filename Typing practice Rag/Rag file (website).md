### 以下是兩個網頁範例
範例1:

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

範例2:
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