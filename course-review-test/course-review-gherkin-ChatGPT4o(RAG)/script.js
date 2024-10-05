// 初始化課程資訊
fetch('data/courses.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('courses', JSON.stringify(data));
        initializeSearchPage();
    })
    .catch(error => console.error('無法載入課程資料:', error));

// 初始化討論資料
fetch('data/discussions.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('discussions', JSON.stringify(data));
        initializeDiscussionPage();
    })
    .catch(error => console.error('無法載入討論資料:', error));


// 課程資訊查詢區功能
function initializeSearchPage() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const resultsPanel = document.getElementById('resultsPanel');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const addReviewButton = document.getElementById('addReviewButton');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    let selectedCourseId = null;

    // 預設顯示所有課程
    renderCourses('');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        renderCourses(query);
    });

    function renderCourses(filter = '') {
        resultsPanel.innerHTML = '';
        const filtered = courses.filter(course => {
            if (searchType.value === 'name') {
                return course.name.includes(filter);
            } else {
                return course.teacher.includes(filter);
            }
        });

        filtered.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = course.id;
            card.innerHTML = `
                <h3>${course.name}</h3>
                <p>老師：${course.teacher}</p>
                <div class="rating">
                    <label>課程涼度：</label><span>${generateStars(course.ratings.coolness)}</span>
                </div>
                <div class="rating">
                    <label>給分甜度：</label><span>${generateStars(course.ratings.generosity)}</span>
                </div>
                <div class="rating">
                    <label>考試難度：</label><span>${generateStars(course.ratings.difficulty)}</span>
                </div>
                <div>討論熱度：${course.reviews.length} 🔥</div>
            `;
            resultsPanel.appendChild(card);

            card.addEventListener('click', () => {
                document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedCourseId = course.id;
                addReviewButton.classList.remove('hidden');
                renderReviews(course);
            });
        });

        if (!resultsPanel.childElementCount) {
            resultsPanel.innerHTML = '<p>沒有符合搜尋條件的結果。</p>';
        }
    }

    function renderReviews(course) {
        reviewsDisplay.innerHTML = '';
        course.reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
                <h4>${review.username}</h4>
                <p>${review.comment}</p>
                <div class="rating">
                    <label>課程涼度：</label><span>${generateStars(review.ratings.coolness)}</span>
                </div>
                <div class="rating">
                    <label>給分甜度：</label><span>${generateStars(review.ratings.generosity)}</span>
                </div>
                <div class="rating">
                    <label>考試難度：</label><span>${generateStars(review.ratings.difficulty)}</span>
                </div>
            `;
            reviewsDisplay.appendChild(reviewDiv);
        });
    }

    // 生成星星圖示，會根據分數生成填滿的星星
    function generateStars(count) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<span class="star">${i < count ? '★' : '☆'}</span>`;
        }
        return stars;
    }

    addReviewButton.addEventListener('click', () => {
        reviewForm.classList.toggle('hidden');
    });

    document.getElementById('submitReview').addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const coolness = parseInt(document.querySelector('.stars[data-type="coolness"]').dataset.value || 0, 10);
        const generosity = parseInt(document.querySelector('.stars[data-type="generosity"]').dataset.value || 0, 10);
        const difficulty = parseInt(document.querySelector('.stars[data-type="difficulty"]').dataset.value || 0, 10);

        if (!username || !comment) {
            alert('請填寫所有欄位');
            return;
        }

        const newReview = {
            username,
            comment,
            ratings: {
                coolness,
                generosity,
                difficulty
            }
        };

        const course = courses.find(c => c.id === selectedCourseId);
        course.reviews.unshift(newReview);
        course.ratings.coolness = calculateAverage(course.reviews.map(c => c.ratings.coolness));
        course.ratings.generosity = calculateAverage(course.reviews.map(c => c.ratings.generosity));
        course.ratings.difficulty = calculateAverage(course.reviews.map(c => c.ratings.difficulty));

        localStorage.setItem('courses', JSON.stringify(courses));
        renderCourses(searchInput.value.trim());
        renderReviews(course);
        reviewForm.classList.add('hidden');
    });

    function calculateAverage(arr) {
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    // 修正星星點擊功能，讓點擊後星星正確填滿
    document.querySelectorAll('.stars').forEach(starGroup => {
        starGroup.addEventListener('click', event => {
            if (event.target.classList.contains('star')) {
                const stars = event.currentTarget.querySelectorAll('.star');
                const value = parseInt(event.target.getAttribute('data-value'), 10);
                stars.forEach((star, index) => {
                    star.textContent = index < value ? '★' : '☆';
                });
                event.target.parentElement.dataset.value = value;
            }
        });
    });
}

// 討論區功能
function initializeDiscussionPage() {
    const discussions = JSON.parse(localStorage.getItem('discussions')) || [];
    const chatbox = document.getElementById('chatbox');
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const nicknameInput = document.getElementById('nickname');
    const nicknameColor = document.getElementById('nicknameColor');

    function renderMessages() {
        chatbox.innerHTML = '';
        discussions.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <span style="color:${msg.color};">${msg.username}</span> (${msg.time}): ${msg.message}
            `;
            chatbox.appendChild(messageDiv);
        });
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        const username = nicknameInput.value.trim();
        const color = nicknameColor.value;

        if (!username || !message) {
            alert('請輸入暱稱和訊息');
            return;
        }

        const newMessage = {
            username,
            color,
            message,
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        discussions.push(newMessage);
        localStorage.setItem('discussions', JSON.stringify(discussions));
        renderMessages();
        messageInput.value = '';
    }

    sendButton.addEventListener('click', sendMessage);
    renderMessages();
}
