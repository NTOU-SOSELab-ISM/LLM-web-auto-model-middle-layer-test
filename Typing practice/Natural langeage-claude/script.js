const app = {
    timeElapsed: 0,
    wpm: 0,
    correctKeystrokes: 0,
    totalKeystrokes: 0,
    currentText: '',
    userInput: '',
    intervalId: null,
    soundEnabled: true,
    startTime: null,
    texts: {
        easy: [
            "The quick brown fox jumps over the lazy dog. This sentence is often used because it contains every letter of the English alphabet. It's a pangram, which means it uses every letter of a given alphabet at least once.",
            "A journey of a thousand miles begins with a single step. This ancient Chinese proverb reminds us that even the longest and most difficult ventures have a starting point; something which begins with one first step.",
            "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them."
        ],
        medium: [
            "Success is not final, failure is not fatal: it is the courage to continue that counts. Many attribute this quote to Winston Churchill, though its true origin is disputed. It emphasizes the importance of perseverance in the face of both success and failure.",
            "I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.' This famous speech by Martin Luther King Jr. was a defining moment in the American Civil Rights Movement.",
            "In three words I can sum up everything I've learned about life: it goes on. This simple yet profound statement by Robert Frost encapsulates a universal truth about the relentless nature of time and the importance of moving forward, regardless of circumstances."
        ],
        hard: [
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair. This opening line from Charles Dickens' 'A Tale of Two Cities' sets the stage for a story of contrast and revolution.",
            "Two roads diverged in a wood, and I — I took the one less traveled by, And that has made all the difference. These concluding lines from Robert Frost's poem 'The Road Not Taken' have become a popular metaphor for the choices we make in life and their long-term consequences.",
            "Ask not what your country can do for you – ask what you can do for your country. This famous line from John F. Kennedy's inaugural address in 1961 challenged Americans to contribute to the public good and participate actively in the American democracy."
        ]
    },
    
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderKeyboard();
        this.generateText();
    },

    cacheDOM() {
        this.themeToggle = document.getElementById('themeToggle');
        this.timerDisplay = document.getElementById('timeElapsed');
        this.wpmDisplay = document.getElementById('wpmValue');
        this.accuracyDisplay = document.getElementById('accuracyValue');
        this.userInputElem = document.getElementById('userInput');
        this.textDisplay = document.getElementById('textDisplay');
        this.addCustomTextBtn = document.getElementById('addCustomText');
        this.keyboard = document.getElementById('keyboard');
        this.customTextModal = document.getElementById('customTextModal');
        this.customTextArea = document.getElementById('customText');
        this.submitCustomTextBtn = document.getElementById('submitCustomText');
        this.cancelCustomTextBtn = document.getElementById('cancelCustomText');
        this.difficultySelector = document.getElementById('difficulty');
        this.toggleSoundBtn = document.getElementById('toggleSound');
        this.keySound = document.getElementById('keySound');
    },

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.userInputElem.addEventListener('input', (e) => this.checkInput(e));
        this.addCustomTextBtn.addEventListener('click', () => this.showCustomTextModal());
        this.submitCustomTextBtn.addEventListener('click', () => this.submitCustomText());
        this.cancelCustomTextBtn.addEventListener('click', () => this.hideCustomTextModal());
        document.addEventListener('keydown', (e) => this.highlightKey(e.key));
        document.addEventListener('keyup', (e) => this.unhighlightKey(e.key));
        this.difficultySelector.addEventListener('change', () => this.generateText());
        this.toggleSoundBtn.addEventListener('click', () => this.toggleSound());
    },

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
    },

    renderKeyboard() {
        const layout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
            ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
        ];

        this.keyboard.innerHTML = '';
        layout.forEach(row => {
            const rowElem = document.createElement('div');
            rowElem.className = 'keyboard-row';
            row.forEach(key => {
                const keyElem = document.createElement('div');
                keyElem.className = 'key';
                keyElem.textContent = key;
                keyElem.dataset.key = key.toLowerCase();
                rowElem.appendChild(keyElem);
            });
            this.keyboard.appendChild(rowElem);
        });
    },

    highlightKey(key) {
        const keyElem = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
        if (keyElem) keyElem.classList.add('active');
    },

    unhighlightKey(key) {
        const keyElem = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
        if (keyElem) keyElem.classList.remove('active');
    },

    generateText() {
        const difficulty = this.difficultySelector.value;
        const textArray = this.texts[difficulty];
        this.currentText = textArray[Math.floor(Math.random() * textArray.length)];
        this.renderText();
        this.resetTyping();
    },

    renderText() {
        this.textDisplay.innerHTML = this.currentText.split('').map(char => 
            `<span>${char}</span>`
        ).join('');
    },

    checkInput(e) {
        const inputValue = e.target.value;
        if (inputValue.length === 1) this.startTimer();

        this.userInput = inputValue;
        const textSpans = this.textDisplay.querySelectorAll('span');

        let correct = true;
        textSpans.forEach((char, index) => {
            if (index < inputValue.length) {
                if (inputValue[index] === this.currentText[index]) {
                    char.className = 'correct';
                    if (correct) this.correctKeystrokes++;
                } else {
                    char.className = 'incorrect';
                    correct = false;
                }
            } else {
                char.className = '';
            }
        });

        this.totalKeystrokes++;
        this.updateAccuracy();

        if (this.soundEnabled) this.playKeySound();

        if (inputValue === this.currentText) {
            this.endTyping();
        }
    },

    startTimer() {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.intervalId = setInterval(() => {
                const currentTime = Date.now();
                this.timeElapsed = Math.floor((currentTime - this.startTime) / 1000);
                this.timerDisplay.textContent = this.timeElapsed;
                this.calculateWPM();
            }, 1000);
        }
    },

    endTyping() {
        clearInterval(this.intervalId);
        this.userInputElem.disabled = true;
    },

    calculateWPM() {
        const words = this.userInput.trim().split(/\s+/).length;
        const minutes = this.timeElapsed / 60;
        this.wpm = Math.round(words / minutes);
        this.wpmDisplay.textContent = this.wpm;
    },

    updateAccuracy() {
        this.accuracyDisplay.textContent = `${this.correctKeystrokes}/${this.totalKeystrokes}`;
    },

    showCustomTextModal() {
        this.customTextModal.style.display = 'block';
    },

    hideCustomTextModal() {
        this.customTextModal.style.display = 'none';
    },

    submitCustomText() {
        const customText = this.customTextArea.value.trim();
        if (customText) {
            this.currentText = customText;
            this.renderText();
            this.hideCustomTextModal();
            this.resetTyping();
        }
    },

    resetTyping() {
        this.timeElapsed = 0;
        this.wpm = 0;
        this.correctKeystrokes = 0;
        this.totalKeystrokes = 0;
        this.userInput = '';
        this.userInputElem.value = '';
        this.userInputElem.disabled = false;
        this.timerDisplay.textContent = this.timeElapsed;
        this.wpmDisplay.textContent = this.wpm;
        this.accuracyDisplay.textContent = '0/0';
        this.startTime = null;
        clearInterval(this.intervalId);
    },

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.toggleSoundBtn.textContent = `聲音: ${this.soundEnabled ? '開' : '關'}`;
    },

    playKeySound() {
        this.keySound.currentTime = 0;
        this.keySound.play().catch(e => console.error("Audio play failed:", e));
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());