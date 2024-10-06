let courses = [];
let comments = [];
let selectedCourseId = null;

// 從 JSON 文件加載數據
async function loadData() {
    const coursesResponse = await fetch('courses.json');
    courses = await coursesResponse.json();

    const commentsResponse = await fetch('comments.json');
    comments = await commentsResponse.json();

    displayCourses(courses);
}

// 顯示課程列表
function displayCourses(coursesToShow) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';

    coursesToShow.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.id = course.id;
        card.innerHTML = `
            <h3>${course.name}</h3>
            <p>教師：${course.teacher}</p>
            <div class="ratings">
                <p>課程涼度：<span class="stars">${getStars(course.coolness)}</span></p>
                <p>給分甜度：<span class="stars">${getStars(course.sweetness)}</span></p>
                <p>考試難度：<span class="stars">${getStars(course.difficulty)}</span></p>
            </div>
            <p>討論熱度：${course.commentCount} 💬</p>
        `;
        card.addEventListener('click', () => selectCourse(course.id));
        courseList.appendChild(card);
    });
}

// 生成星星評分
function getStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// 選擇課程
function selectCourse(courseId) {
    selectedCourseId = courseId;
    document.querySelectorAll('.course-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`.course-card[data-id="${courseId}"]`).classList.add('selected');
    displayComments(courseId);
    initStars();
}

// 顯示評論
function displayComments(courseId) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    const courseComments = comments.filter(comment => comment.courseId === courseId);
    courseComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <h4>${comment.username}</h4>
            <p>${comment.content}</p>
            <p>課程涼度：<span class="stars">${getStars(comment.coolness)}</span></p>
            <p>給分甜度：<span class="stars">${getStars(comment.sweetness)}</span></p>
            <p>考試難度：<span class="stars">${getStars(comment.difficulty)}</span></p>
        `;
        commentsList.appendChild(commentElement);
    });
}

// 搜索課程
function searchCourses() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const searchType = document.querySelector('input[name="search-type"]:checked').value;

    const filteredCourses = courses.filter(course => {
        if (searchType === 'course') {
            return course.name.toLowerCase().includes(searchInput);
        } else {
            return course.teacher.toLowerCase().includes(searchInput);
        }
    });

    displayCourses(filteredCourses);
}

// 初始化評分星星
function initStars() {
    document.querySelectorAll('.stars[data-rating]').forEach(starsContainer => {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.textContent = '☆';
            star.addEventListener('click', () => {
                setStars(starsContainer, i + 1);
            });
            starsContainer.appendChild(star);
        }
        starsContainer.dataset.value = '0';
    });
}

// 設置星星評分
function setStars(container, rating) {
    const stars = container.querySelectorAll('span');
    stars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
    });
    container.dataset.value = rating.toString();
}

// 提交評論
function submitComment() {
    if (selectedCourseId === null) {
        alert('請先選擇一個課程');
        return;
    }

    const username = document.getElementById('username').value;
    const content = document.getElementById('comment-content').value;
    const coolness = parseInt(document.querySelector('.stars[data-rating="course-coolness"]').dataset.value);
    const sweetness = parseInt(document.querySelector('.stars[data-rating="grading-sweetness"]').dataset.value);
    const difficulty = parseInt(document.querySelector('.stars[data-rating="exam-difficulty"]').dataset.value);

    if (!username || !content || coolness === 0 || sweetness === 0 || difficulty === 0) {
        alert('請填寫所有欄位並給出評分');
        return;
    }

    const newComment = {
        courseId: selectedCourseId,
        username,
        content,
        coolness,
        sweetness,
        difficulty
    };

    comments.unshift(newComment);
    displayComments(selectedCourseId);
    updateCourseRatings(selectedCourseId);
    
    // 重置表單
    document.getElementById('username').value = '';
    document.getElementById('comment-content').value = '';
    initStars();
    
    // 隱藏評論表單
    document.getElementById('comment-form').style.display = 'none';
}

// 更新課程評分
function updateCourseRatings(courseId) {
    const course = courses.find(c => c.id === courseId);
    const courseComments = comments.filter(c => c.courseId === courseId);

    course.coolness = Math.round(courseComments.reduce((sum, comment) => sum + comment.coolness, 0) / courseComments.length);
    course.sweetness = Math.round(courseComments.reduce((sum, comment) => sum + comment.sweetness, 0) / courseComments.length);
    course.difficulty = Math.round(courseComments.reduce((sum, comment) => sum + comment.difficulty, 0) / courseComments.length);
    course.commentCount = courseComments.length;

    displayCourses(courses);
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('search-button').addEventListener('click', searchCourses);
    document.getElementById('add-comment-button').addEventListener('click', () => {
        if (selectedCourseId === null) {
            alert('請先選擇一個課程');
            return;
        }
        document.getElementById('comment-form').style.display = 'block';
        initStars();
    });
    document.getElementById('submit-comment').addEventListener('click', submitComment);
});