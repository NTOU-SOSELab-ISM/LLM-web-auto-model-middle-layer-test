let fakeData = {
    "courses": [
        {
            "name": "JavaScript 入門",
            "teacher": "王老師",
            "rating": {
                "coolness": 3,
                "grading": 4,
                "difficulty": 2
            },
            "comments": [
                {
                    "username": "Alice",
                    "content": "這堂課很實用，但有點難。",
                    "coolness": 3,
                    "grading": 4,
                    "difficulty": 2
                },
                {
                    "username": "Bob",
                    "content": "老師講得很詳細，給分也很友善。",
                    "coolness": 4,
                    "grading": 5,
                    "difficulty": 2
                }
            ]
        },
        {
            "name": "前端開發實戰",
            "teacher": "李老師",
            "rating": {
                "coolness": 5,
                "grading": 3,
                "difficulty": 4
            },
            "comments": [
                {
                    "username": "Charlie",
                    "content": "課程內容深入，挑戰性強。",
                    "coolness": 5,
                    "grading": 3,
                    "difficulty": 4
                }
            ]
        }
    ]
};

// 初始化頁面
window.onload = function () {
    loadCourses();
};

// 顯示課程列表
function loadCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    fakeData.courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.name}</h3>
            <p>老師: ${course.teacher}</p>
            <p>評分: ${course.rating.coolness} 涼度, ${course.rating.grading} 給分甜度, ${course.rating.difficulty} 考試難度</p>
        `;
        courseCard.addEventListener('click', () => showCourseDetail(index));
        courseList.appendChild(courseCard);
    });
}

// 顯示選中的課程評論
function showCourseDetail(index) {
    const course = fakeData.courses[index];
    document.getElementById('addReviewSection').style.display = 'none';
    document.getElementById('courseReviews').innerHTML = '';
    course.comments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'course-card';
        commentCard.innerHTML = `
            <h4>${comment.username}</h4>
            <p>${comment.content}</p>
            <p>涼度: ${comment.coolness} 給分甜度: ${comment.grading} 作業難度: ${comment.difficulty}</p>
        `;
        document.getElementById('courseReviews').appendChild(commentCard);
    });
}

// 切換至新增評論模式
function toggleAddReview() {
    const section = document.getElementById('addReviewSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// 提交評論
function submitReview() {
    const username = document.getElementById('username').value;
    const review = document.getElementById('review').value;
    const coolness = getSelectedRating('coolnessRating');
    const grading = getSelectedRating('gradingRating');
    const difficulty = getSelectedRating('difficultyRating');

    const newComment = {
        "username": username,
        "content": review,
        "coolness": coolness,
        "grading": grading,
        "difficulty": difficulty
    };

    // 新增評論到第一堂課的評論
    fakeData.courses[0].comments.unshift(newComment);
    toggleAddReview();
    showCourseDetail(0);
}

// 評分系統
function createRatingElement(id) {
    const container = document.getElementById(id);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('div');
        star.addEventListener('click', () => selectRating(id, i));
        container.appendChild(star);
    }
}

function selectRating(id, rating) {
    const stars = document.getElementById(id).children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('selected');
        if (i < rating) {
            stars[i].classList.add('selected');
        }
    }
}

function getSelectedRating(id) {
    const stars = document.getElementById(id).children;
    let rating = 0;
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].classList.contains('selected')) {
            rating++;
        }
    }
    return rating;
}

// 初始化評分區域
createRatingElement('coolnessRating');
createRatingElement('gradingRating');
createRatingElement('difficultyRating');
