let courses = [];
let messages = [];
let currentCourse = null;

// 載入課程數據
async function loadCourses() {
    const response = await fetch('courses.json');
    courses = await response.json();
    displayCourses(courses);
}

// 載入討論訊息
async function loadMessages() {
    const response = await fetch('messages.json');
    messages = await response.json();
    displayMessages();
}

// 顯示課程列表
function displayCourses(coursesToShow) {
    const courseList = document.getElementById('courseList');
    if (!courseList) return;

    courseList.innerHTML = '';
    coursesToShow.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3>${course.name}</h3>
            <p>教師: ${course.teacher}</p>
            <div>課程涼度: ${generateStars(course.ratings.coolness)}</div>
            <div>給分甜度: ${generateStars(course.ratings.grading)}</div>
            <div>考試難度: ${generateStars(course.ratings.difficulty)}</div>
            <div>討論熱度: ${course.reviews.length} 🔥</div>
        `;
        card.addEventListener('click', () => displayCourseDetails(course));
        courseList.appendChild(card);
    });
}

// 生成星星評分
function generateStars(rating) {
    return `<span class="stars" data-rating="${Math.round(rating)}"></span>`;
}

// 顯示課程詳情
function displayCourseDetails(course) {
    currentCourse = course;
    const courseDetails = document.getElementById('courseDetails');
    if (!courseDetails) return;

    document.querySelectorAll('.course-card').forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    courseDetails.innerHTML = `
        <h2>${course.name}</h2>
        <p>教師: ${course.teacher}</p>
        <button id="addReviewButton">新增課程評論</button>
        <div id="reviewForm" style="display: none;">
            <input type="text" id="reviewUsername" placeholder="輸入使用者名稱">
            <textarea id="reviewContent" placeholder="輸入評論"></textarea>
            <div class="rating">
                <label>課程涼度評分：</label>
                <div class="stars-input" data-rating="coolness"></div>
            </div>
            <div class="rating">
                <label>給分甜度評分：</label>
                <div class="stars-input" data-rating="grading"></div>
            </div>
            <div class="rating">
                <label>考試難度評分：</label>
                <div class="stars-input" data-rating="difficulty"></div>
            </div>
            <button id="submitReview">提交評論</button>
        </div>
        <div id="courseReviews"></div>
    `;

    displayReviews(course);

    document.getElementById('addReviewButton').addEventListener('click', toggleReviewForm);
    document.getElementById('submitReview').addEventListener('click', submitReview);
    document.querySelectorAll('.stars-input').forEach(starsElement => {
        initializeStars(starsElement);
        starsElement.addEventListener('click', handleStarRating);
    });
}

// 顯示評論
function displayReviews(course) {
    const reviewsContainer = document.getElementById('courseReviews');
    reviewsContainer.innerHTML = '';
    course.reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <h4>${review.username}</h4>
            <p>${review.content}</p>
            <div>課程涼度: ${generateStars(review.ratings.coolness)}</div>
            <div>給分甜度: ${generateStars(review.ratings.grading)}</div>
            <div>考試難度: ${generateStars(review.ratings.difficulty)}</div>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

// 切換評論表單顯示
function toggleReviewForm() {
    const form = document.getElementById('reviewForm');
    const button = document.getElementById('addReviewButton');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        button.textContent = '顯示課程評論';
    } else {
        form.style.display = 'none';
        button.textContent = '新增課程評論';
    }
}

// 初始化星星
function initializeStars(starsElement) {
    starsElement.innerHTML = '☆'.repeat(5);
    starsElement.dataset.rating = '0';
}

// 處理星星評分
function handleStarRating(event) {
    const starsElement = event.currentTarget;
    const stars = starsElement.children;
    const rating = Array.from(stars).indexOf(event.target) + 1;
    updateStars(starsElement, rating);
}

// 更新星星顯示
function updateStars(starsElement, rating) {
    starsElement.innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    starsElement.dataset.rating = rating;
}

// 提交評論
function submitReview() {
    const username = document.getElementById('reviewUsername').value;
    const content = document.getElementById('reviewContent').value;
    const coolness = document.querySelector('.stars-input[data-rating="coolness"]').dataset.rating;
    const grading = document.querySelector('.stars-input[data-rating="grading"]').dataset.rating;
    const difficulty = document.querySelector('.stars-input[data-rating="difficulty"]').dataset.rating;

    if (!username || !content || coolness === '0' || grading === '0' || difficulty === '0') {
        alert('請填寫所有欄位');
        return;
    }

    const newReview = {
        username,
        content,
        ratings: {
            coolness: parseInt(coolness),
            grading: parseInt(grading),
            difficulty: parseInt(difficulty)
        }
    };

    currentCourse.reviews.unshift(newReview);
    updateCourseRatings(currentCourse);
    saveCourses();
    displayCourseDetails(currentCourse);
    updateCourseCard(currentCourse);
    toggleReviewForm();
}

// 更新課程評分
function updateCourseRatings(course) {
    const ratings = course.reviews.map(review => review.ratings);
    course.ratings = {
        coolness: average(ratings.map(r => r.coolness)),
        grading: average(ratings.map(r => r.grading)),
        difficulty: average(ratings.map(r => r.difficulty))
    };
}

// 計算平均值
function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// 更新左側課程卡片
function updateCourseCard(course) {
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        if (card.querySelector('h3').textContent === course.name) {
            card.innerHTML = `
                <h3>${course.name}</h3>
                <p>教師: ${course.teacher}</p>
                <div>課程涼度: ${generateStars(course.ratings.coolness)}</div>
                <div>給分甜度: ${generateStars(course.ratings.grading)}</div>
                <div>考試難度: ${generateStars(course.ratings.difficulty)}</div>
                <div>討論熱度: ${course.reviews.length} 🔥</div>
            `;
        }
    });
}

// 保存課程數據
function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// 搜索課程
function searchCourses() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    const filteredCourses = courses.filter(course => {
        if (searchType === 'course') {
            return course.name.toLowerCase().includes(searchInput);
        } else {
            return course.teacher.toLowerCase().includes(searchInput);
        }
    });

    displayCourses(filteredCourses);
}

// 討論區功能
function displayMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatMessages.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span class="username" style="color: ${message.color}">${message.username}</span>
            <span class="time">${message.time}</span>
            <p>${message.content}</p>
        `;
        chatMessages.appendChild(messageElement);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const userColor = document.getElementById('userColor').value;
    const userNickname = document.getElementById('userNickname').value;
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();

    if (!userNickname || !content) {
        alert('請輸入暱稱和訊息');
        return;
    }

    const newMessage = {
        username: userNickname,
        color: userColor,
        content: content,
        time: new Date().toLocaleTimeString()
    };

    messages.push(newMessage);
    saveMessages();
    displayMessages();
    messageInput.value = '';
}

function saveMessages() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('courseList')) {
        loadCourses();
        document.getElementById('searchButton').addEventListener('click', searchCourses);
    }

    if (document.getElementById('chatMessages')) {
        loadMessages();
        document.getElementById('sendMessage').addEventListener('click', sendMessage);
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});