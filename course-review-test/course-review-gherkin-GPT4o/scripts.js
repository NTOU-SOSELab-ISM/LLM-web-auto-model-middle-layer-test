document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const reviewsContainer = document.getElementById('reviews');
    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewForm = document.getElementById('review-form');
    const submitReviewBtn = document.getElementById('submit-review-btn');
    const searchBtn = document.getElementById('search-btn');

    // 變數用來儲存使用者的星星評分
    let coolnessRating = 0;
    let gradingRating = 0;
    let difficultyRating = 0;

    const fakeData = [
        {
            courseName: "JavaScript 入門",
            teacher: "王老師",
            coolness: 3,
            grading: 4,
            difficulty: 2,
            reviewCount: 5,
            reviews: [
                { user: "使用者1", comment: "很不錯的課程", coolness: 3, grading: 4, difficulty: 2 },
                { user: "使用者2", comment: "老師很會講課", coolness: 4, grading: 5, difficulty: 1 }
            ]
        },
        {
            courseName: "Python 程式設計",
            teacher: "李老師",
            coolness: 5,
            grading: 3,
            difficulty: 4,
            reviewCount: 8,
            reviews: [
                { user: "使用者3", comment: "內容豐富但難度較高", coolness: 5, grading: 3, difficulty: 4 }
            ]
        }
    ];

    function createStarRating(score) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= score ? 'filled' : 'empty'}">★</span>`;
        }
        return `<div class="stars">${stars}</div>`;
    }

    function renderCourseList(courses) {
        courseList.innerHTML = '';
        courses.forEach((course, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${course.courseName}</h3>
                <p>老師: ${course.teacher}</p>
                <p>涼度: ${createStarRating(course.coolness)}</p>
                <p>給分甜度: ${createStarRating(course.grading)}</p>
                <p>考試難度: ${createStarRating(course.difficulty)}</p>
                <p>討論熱度: ${course.reviews.length} 則評論</p>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.course-list .card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                renderCourseDetails(index);
            });
            courseList.appendChild(card);
        });
    }

    function renderCourseDetails(index) {
        const course = fakeData[index];
        reviewsContainer.innerHTML = '';
        course.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            reviewCard.innerHTML = `
                <h4>${review.user}</h4>
                <p>${review.comment}</p>
                <p>涼度: ${createStarRating(review.coolness)}</p>
                <p>給分甜度: ${createStarRating(review.grading)}</p>
                <p>考試難度: ${createStarRating(review.difficulty)}</p>
            `;
            reviewsContainer.appendChild(reviewCard);
        });
    }

    // 星星評分點擊功能
    function handleStarRating(starElements, ratingType) {
        starElements.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));
                starElements.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('filled');
                        s.classList.remove('empty');
                    } else {
                        s.classList.add('empty');
                        s.classList.remove('filled');
                    }
                });

                // 設定對應的評分變數
                if (ratingType === 'coolness') {
                    coolnessRating = value;
                } else if (ratingType === 'grading') {
                    gradingRating = value;
                } else if (ratingType === 'difficulty') {
                    difficultyRating = value;
                }
            });
        });
    }

    // 新增評論按鈕顯示評論表單
    addReviewBtn.addEventListener('click', () => {
        reviewForm.style.display = 'block';

        // 監聽星星點擊事件
        handleStarRating(document.querySelectorAll('#coolness-rating .star'), 'coolness');
        handleStarRating(document.querySelectorAll('#grading-rating .star'), 'grading');
        handleStarRating(document.querySelectorAll('#difficulty-rating .star'), 'difficulty');
    });

    // 提交評論功能
    submitReviewBtn.addEventListener('click', () => {
        const user = document.getElementById('review-user').value;
        const comment = document.getElementById('review-comment').value;

        // 確保用戶已選擇所有三項評分
        if (coolnessRating === 0 || gradingRating === 0 || difficultyRating === 0) {
            alert('請為所有評分項目選擇星星評分！');
            return;
        }

        const newReview = {
            user,
            comment,
            coolness: coolnessRating,
            grading: gradingRating,
            difficulty: difficultyRating
        };

        // 假設新增評論到第一個課程
        fakeData[0].reviews.push(newReview);
        renderCourseDetails(0);
        reviewForm.style.display = 'none';
    });

    // 搜尋功能
    searchBtn.addEventListener('click', () => {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const searchType = document.getElementById('search-type').value;
        const filteredCourses = fakeData.filter(course =>
            searchType === 'course'
                ? course.courseName.toLowerCase().includes(searchTerm)
                : course.teacher.toLowerCase().includes(searchTerm)
        );

        if (filteredCourses.length > 0) {
            renderCourseList(filteredCourses);
        } else {
            courseList.innerHTML = '<p>查無結果</p>';
        }
    });

    renderCourseList(fakeData); // 初始載入課程列表
});
