let courses = [];
let currentCourse = null;

// 載入課程資料
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();

    // 添加事件監聽器
    const addReviewBtn = document.getElementById('addReviewBtn');
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const searchButton = document.getElementById('searchButton');

    if (addReviewBtn) addReviewBtn.addEventListener('click', showAddReviewForm);
    if (submitReviewBtn) submitReviewBtn.addEventListener('click', submitReview);
    if (searchButton) searchButton.addEventListener('click', performSearch);

    // 星級評分功能
    document.querySelectorAll('#addReviewForm .stars').forEach(starsElement => {
        starsElement.addEventListener('click', handleStarRating);
    });
});

function loadCourses() {
    fetch('courses.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded courses:', data);  // 添加日誌
            courses = data;
            renderCourseList(courses);
        })
        .catch(e => {
            console.error('載入課程資料時發生錯誤:', e);
            alert('無法載入課程資料，請稍後再試。');
        });
}

function renderCourseList(coursesToRender) {
    const courseList = document.querySelector('.course-list');
    if (!courseList) {
        console.error('找不到課程列表元素');
        return;
    }
    courseList.innerHTML = '';
    
    coursesToRender.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3>${course.name}</h3>
            <p>老師：${course.teacher}</p>
            <div class="rating">
                <p>課程涼度：<span class="stars" data-rating="${Math.round(course.ratings.coolness)}"></span></p>
                <p>給分甜度：<span class="stars" data-rating="${Math.round(course.ratings.grading)}"></span></p>
                <p>考試難度：<span class="stars" data-rating="${Math.round(course.ratings.difficulty)}"></span></p>
            </div>
            <p>討論熱度：<i class="fas fa-comment"></i> ${course.reviews.length}</p>
        `;
        card.addEventListener('click', () => showCourseDetails(course));
        courseList.appendChild(card);
    });
}

function showCourseDetails(course) {
    currentCourse = course;
    const detailsSection = document.querySelector('.course-details');
    const reviewsList = document.getElementById('reviewsList');
    const selectedCourseName = document.getElementById('selectedCourseName');
    
    if (selectedCourseName) selectedCourseName.textContent = `${course.name} - ${course.teacher}`;
    if (reviewsList) {
        reviewsList.innerHTML = '';
        
        course.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <h4>${review.username}</h4>
                <p>${review.content}</p>
                <div class="rating">
                    <p>課程涼度：<span class="stars" data-rating="${review.ratings.coolness}"></span></p>
                    <p>給分甜度：<span class="stars" data-rating="${review.ratings.grading}"></span></p>
                    <p>考試難度：<span class="stars" data-rating="${review.ratings.difficulty}"></span></p>
                </div>
            `;
            reviewsList.appendChild(reviewCard);
        });
    }
    
    if (detailsSection) detailsSection.style.display = 'block';
}

function showAddReviewForm() {
    const addReviewForm = document.getElementById('addReviewForm');
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewForm) addReviewForm.style.display = 'block';
    if (addReviewBtn) addReviewBtn.style.display = 'none';
}

function submitReview() {
    const username = document.getElementById('reviewerName')?.value;
    const content = document.getElementById('reviewContent')?.value;
    const coolness = document.querySelector('#addReviewForm .stars[data-rating="coolness"]')?.dataset.rating;
    const grading = document.querySelector('#addReviewForm .stars[data-rating="grading"]')?.dataset.rating;
    const difficulty = document.querySelector('#addReviewForm .stars[data-rating="difficulty"]')?.dataset.rating;
    
    console.log('Submit review:', { username, content, coolness, grading, difficulty });  // 添加日誌

    if (username && content && coolness && grading && difficulty) {
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
        showCourseDetails(currentCourse);
        
        const addReviewForm = document.getElementById('addReviewForm');
        const addReviewBtn = document.getElementById('addReviewBtn');
        if (addReviewForm) addReviewForm.style.display = 'none';
        if (addReviewBtn) addReviewBtn.style.display = 'block';
        
        // 重置表單
        if (document.getElementById('reviewerName')) document.getElementById('reviewerName').value = '';
        if (document.getElementById('reviewContent')) document.getElementById('reviewContent').value = '';
        document.querySelectorAll('#addReviewForm .stars').forEach(star => star.dataset.rating = '0');
        
        alert('評論已成功提交！');
    } else {
        alert('請填寫所有欄位並給予評分。');
    }
}

function updateCourseRatings(course) {
    const ratings = course.reviews.reduce((acc, review) => {
        acc.coolness += review.ratings.coolness;
        acc.grading += review.ratings.grading;
        acc.difficulty += review.ratings.difficulty;
        return acc;
    }, { coolness: 0, grading: 0, difficulty: 0 });
    
    const reviewCount = course.reviews.length;
    course.ratings = {
        coolness: ratings.coolness / reviewCount,
        grading: ratings.grading / reviewCount,
        difficulty: ratings.difficulty / reviewCount
    };
}

function handleStarRating(e) {
    const starsElement = e.currentTarget;
    const rect = starsElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const rating = Math.ceil(x / starWidth);
    starsElement.dataset.rating = rating;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const searchType = document.querySelector('input[name="searchType"]:checked')?.value || 'course';
    
    const filteredCourses = courses.filter(course => {
        if (searchType === 'course') {
            return course.name.toLowerCase().includes(searchTerm);
        } else {
            return course.teacher.toLowerCase().includes(searchTerm);
        }
    });
    
    renderCourseList(filteredCourses);
}