let coursesData = [
    {
        "name": "程式設計入門",
        "teacher": "李老師",
        "ratings": {
            "coolness": 4,
            "grading": 3,
            "difficulty": 2
        },
        "reviews": [
            {
                "user": "Alice",
                "comment": "這堂課內容深入淺出，非常適合初學者。",
                "ratings": {
                    "coolness": 4,
                    "grading": 3,
                    "difficulty": 2
                }
            },
            {
                "user": "Bob",
                "comment": "老師講解清楚，作業量剛好。",
                "ratings": {
                    "coolness": 4,
                    "grading": 4,
                    "difficulty": 3
                }
            }
        ]
    },
    {
        "name": "線性代數",
        "teacher": "張老師",
        "ratings": {
            "coolness": 3,
            "grading": 5,
            "difficulty": 4
        },
        "reviews": [
            {
                "user": "Charlie",
                "comment": "老師教得很好，內容豐富。",
                "ratings": {
                    "coolness": 3,
                    "grading": 5,
                    "difficulty": 4
                }
            },
            {
                "user": "David",
                "comment": "課程難度適中，學到了很多知識。",
                "ratings": {
                    "coolness": 4,
                    "grading": 4,
                    "difficulty": 4
                }
            }
        ]
    },
    {
        "name": "微積分",
        "teacher": "王老師",
        "ratings": {
            "coolness": 2,
            "grading": 3,
            "difficulty": 5
        },
        "reviews": [
            {
                "user": "Eve",
                "comment": "內容艱深，老師講解清楚。",
                "ratings": {
                    "coolness": 2,
                    "grading": 3,
                    "difficulty": 5
                }
            },
            {
                "user": "Frank",
                "comment": "考試很難，需要很多準備。",
                "ratings": {
                    "coolness": 2,
                    "grading": 2,
                    "difficulty": 5
                }
            }
        ]
    },
    {
        "name": "資料結構",
        "teacher": "劉老師",
        "ratings": {
            "coolness": 4,
            "grading": 4,
            "difficulty": 3
        },
        "reviews": [
            {
                "user": "Grace",
                "comment": "課程內容豐富，老師講解清楚。",
                "ratings": {
                    "coolness": 4,
                    "grading": 4,
                    "difficulty": 3
                }
            },
            {
                "user": "Hank",
                "comment": "內容有點難，但老師很有耐心。",
                "ratings": {
                    "coolness": 3,
                    "grading": 4,
                    "difficulty": 4
                }
            }
        ]
    }
]; // 假資料

let currentCourse = null;

window.onload = function() {
    updateDiscussionCount(); // 更新討論度
    renderCourses(coursesData); // 預先渲染所有課程
}

// 計算每門課的討論度
function updateDiscussionCount() {
    coursesData.forEach(course => {
        course.discussion = course.reviews.length; // 討論度等於評論數
    });
}

// 渲染課程列表
function renderCourses(courses) {
    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('card');
        courseCard.innerHTML = `
            <h3>${course.name}</h3>
            <p>老師: ${course.teacher}</p>
            <p>評分: 涼度 ${renderStars(course.ratings.coolness)} | 給分 ${renderStars(course.ratings.grading)} | 考試難度 ${renderStars(course.ratings.difficulty)}</p>
            <p>討論度: ${course.discussion}</p>
        `;
        courseCard.onclick = () => selectCourse(course, courseCard);
        coursesList.appendChild(courseCard);
    });
}

// 選擇課程並顯示其評論
function selectCourse(course, element) {
    const courseDetails = document.getElementById('course-details');
    currentCourse = course;

    // 標記選擇的課程
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('add-review-btn').style.display = 'block'; // 顯示新增評論按鈕
    document.getElementById('reviews').innerHTML = ''; // 清空評論
    course.reviews.forEach(review => renderReview(review));
}

// 渲染評論
function renderReview(review) {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('card');
    reviewCard.innerHTML = `
        <h4>${review.user}</h4>
        <p>${review.comment}</p>
        <p>涼度 ${renderStars(review.ratings.coolness)} | 給分 ${renderStars(review.ratings.grading)} | 考試難度 ${renderStars(review.ratings.difficulty)}</p>
    `;
    document.getElementById('reviews').appendChild(reviewCard);
}

// 顯示新增評論表單
function showReviewForm() {
    document.getElementById('review-form').style.display = 'block';
}

// 提交評論
function submitReview() {
    const userName = document.getElementById('user-name').value;
    const userComment = document.getElementById('user-comment').value;
    const coolness = document.getElementById('coolness-rating').value;
    const grading = document.getElementById('grading-rating').value;
    const difficulty = document.getElementById('difficulty-rating').value;

    const newReview = {
        user: userName,
        comment: userComment,
        ratings: {
            coolness: parseInt(coolness),
            grading: parseInt(grading),
            difficulty: parseInt(difficulty)
        }
    };

    currentCourse.reviews.push(newReview); // 新增評論
    currentCourse.discussion = currentCourse.reviews.length; // 更新討論度
    renderReview(newReview); // 即時顯示新評論
    document.getElementById('review-form').style.display = 'none'; // 隱藏表單
}

// 搜尋功能
function search() {
    const keyword = document.getElementById('search').value.toLowerCase();
    const searchType = document.getElementById('search-type').value;

    const results = coursesData.filter(course => {
        if (searchType === 'course') {
            return course.name.toLowerCase().includes(keyword);
        } else {
            return course.teacher.toLowerCase().includes(keyword);
        }
    });

    renderCourses(results);
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

function sendMessage() {
    const userColor = document.getElementById('user-color').value;
    const userName = document.getElementById('user-name').value;
    const message = document.getElementById('message').value;

    const messageData = {
        userName,
        userColor,
        message,
        time: new Date().toLocaleString()
    };

    renderMessage(messageData);
}

function renderMessage(data) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
        <span style="color:${data.userColor}">${data.userName}</span> (${data.time}): ${data.message}
    `;
    chatBox.appendChild(messageElement);
}
