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
