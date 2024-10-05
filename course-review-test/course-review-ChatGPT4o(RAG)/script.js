// document.addEventListener("DOMContentLoaded", () => {
//     initializeSearchPage();
//     if (document.getElementById('chatbox')) {
//         initializeDiscussionPage();
//     }
// });

// 初始化課程資料
const courseData = JSON.parse(localStorage.getItem('courses')) || [
    {
        id: 1,
        name: "資料結構",
        teacher: "李老師",
        coolness: 3,
        grading: 4,
        difficulty: 2,
        comments: [
            { username: "學生A", comment: "課程內容豐富", coolness: 4, grading: 4, difficulty: 3, time: "2024-10-01 09:00" },
            { username: "學生B", comment: "考試稍難", coolness: 3, grading: 2, difficulty: 4, time: "2024-10-02 10:00" }
        ]
    },
    {
        id: 2,
        name: "演算法",
        teacher: "陳老師",
        coolness: 4,
        grading: 5,
        difficulty: 3,
        comments: [
            { username: "學生C", comment: "內容很充實", coolness: 5, grading: 5, difficulty: 4, time: "2024-10-03 08:00" }
        ]
    }
];

// 初始化課程資訊查詢頁面
function initializeSearchPage() {
    const resultsPanel = document.getElementById('resultsPanel');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const addReviewButton = document.getElementById('addReviewButton');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    let selectedCourseId = null;

    reviewForm.dataset.coolness = 0;
    reviewForm.dataset.grading = 0;
    reviewForm.dataset.difficulty = 0;

    function renderCourses(filter = '') {
        resultsPanel.innerHTML = '';
        const filtered = courseData.filter(course => {
            if (searchType.value === 'course') {
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
                <div class="region">${course.teacher}</div>
                <div class="ratings">
                    <div><span class="label">課程涼度：</span><span class="stars">${generateStars(course.coolness)}</span></div>
                    <div><span class="label">給分甜度：</span><span class="stars">${generateStars(course.grading)}</span></div>
                    <div><span class="label">考試難度：</span><span class="stars">${generateStars(course.difficulty)}</span></div>
                </div>
                <div class="popularity">評論數量：${course.comments.length}</div>
            `;
            resultsPanel.appendChild(card);
        });

        if (resultsPanel.childElementCount === 0) {
            resultsPanel.innerHTML = '<p>沒有符合搜尋條件的結果。</p>';
        }
    }

    // 生成星星圖示
    function generateStars(count) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<span>${i < count ? '★' : '☆'}</span>`;
        }
        return stars;
    }

    // 搜尋事件
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        renderCourses(query);
    });

    // 點擊card選擇課程
    resultsPanel.addEventListener('click', (e) => {
        let card = e.target.closest('.card');
        if (card) {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCourseId = parseInt(card.dataset.id);
            addReviewButton.classList.remove('hidden');
            renderReviews();
        }
    });

    // 點擊新增評論按鈕
    addReviewButton.addEventListener('click', () => {
        reviewForm.classList.toggle('hidden');
    });

    // 星星選擇
    reviewForm.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            const type = e.target.parentElement.dataset.type;
            const stars = e.target.parentElement.children;
            let rating = 0;
            for (let i = 0; i <= Array.from(stars).indexOf(e.target); i++) {
                stars[i].textContent = '★';
                rating++;
            }
            for (let i = rating; i < 5; i++) {
                stars[i].textContent = '☆';
            }
            reviewForm.dataset[type] = rating;
        }
    });

    // 提交評論
    const submitReview = document.getElementById('submitReview');
    submitReview.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const coolness = parseInt(reviewForm.dataset.coolness) || 0;
        const grading = parseInt(reviewForm.dataset.grading) || 0;
        const difficulty = parseInt(reviewForm.dataset.difficulty) || 0;

        if (!username || !comment) {
            alert('請填寫所有欄位');
            return;
        }

        const newComment = {
            username,
            comment,
            coolness,
            grading,
            difficulty,
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        const course = courseData.find(course => course.id === selectedCourseId);
        course.comments.unshift(newComment);
        localStorage.setItem('courses', JSON.stringify(courseData));
        renderCourses(searchInput.value.trim());
        renderReviews();
        reviewForm.classList.add('hidden');
    });

    // 渲染評論
    function renderReviews() {
        reviewsDisplay.innerHTML = '';
        const course = courseData.find(course => course.id === selectedCourseId);
        if (course) {
            course.comments.forEach(c => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `
                    <h4>${c.username} <span class="comment-time">${c.time}</span></h4>
                    <p class="comment-text">${c.comment}</p>
                    <div class="ratings">
                        <div><span class="label">課程涼度：</span><span class="stars">${generateStars(c.coolness)}</span></div>
                        <div><span class="label">給分甜度：</span><span class="stars">${generateStars(c.grading)}</span></div>
                        <div><span class="label">考試難度：</span><span class="stars">${generateStars(c.difficulty)}</span></div>
                    </div>
                `;
                reviewsDisplay.appendChild(commentDiv);
            });
        }
    }

    renderCourses();
}

// 討論區初始化
function initializeDiscussionPage() {
    const discussionsData = JSON.parse(localStorage.getItem('discussions')) || [
        { username: "Alice", color: "#FF0000", message: "有人上過資料結構嗎？", time: "2024-10-01 09:00" },
        { username: "Bob", color: "#0000FF", message: "上過，還不錯！", time: "2024-10-01 09:15" },
        { username: "Charlie", color: "#00FF00", message: "考試有點難", time: "2024-10-01 09:30" }
    ];

    const chatbox = document.getElementById('chatbox');
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const nicknameInput = document.getElementById('nickname');
    const nicknameColor = document.getElementById('nicknameColor');

    function renderMessages() {
        chatbox.innerHTML = '';
        discussionsData.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <div style="color:${msg.color}">${msg.username} (${msg.time}):</div>
                <div>${msg.message}</div>
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
            alert('請填寫暱稱和訊息');
            return;
        }

        const newMessage = {
            username,
            color,
            message,
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        discussionsData.push(newMessage);
        localStorage.setItem('discussions', JSON.stringify(discussionsData));
        renderMessages();
        messageInput.value = '';
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    renderMessages();
}

document.addEventListener('DOMContentLoaded', function() {
    const isDiscussionPage = document.querySelector('title').textContent.includes('討論區');
    if (isDiscussionPage) {
        initializeDiscussionPage();
    } else {
        initializeSearchPage();
    }
});