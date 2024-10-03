// ... (之前的代碼保持不變)

function submitReview() {
    const reviewerName = document.getElementById('reviewerName').value;
    const reviewContent = document.getElementById('reviewContent').value;
    const coolness = document.querySelector('.stars[data-rating="coolness"]').dataset.value;
    const grading = document.querySelector('.stars[data-rating="grading"]').dataset.value;
    const difficulty = document.querySelector('.stars[data-rating="difficulty"]').dataset.value;

    if (!reviewerName || !reviewContent || !coolness || !grading || !difficulty) {
        alert('請填寫所有欄位');
        return;
    }

    const newReview = {
        id: Date.now(),
        username: reviewerName,
        content: reviewContent,
        coolness: parseInt(coolness),
        grading: parseInt(grading),
        difficulty: parseInt(difficulty)
    };

    // 在實際應用中，這裡應該發送 API 請求來保存評論
    // 現在我們只是將新評論添加到當前顯示的評論列表中
    const reviewsList = document.getElementById('reviewsList');
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review';
    reviewElement.innerHTML = `
        <h4>${newReview.username}</h4>
        <p>${newReview.content}</p>
        <p>涼度：${getStars(newReview.coolness)}</p>
        <p>給分：${getStars(newReview.grading)}</p>
        <p>難度：${getStars(newReview.difficulty)}</p>
    `;
    reviewsList.insertBefore(reviewElement, reviewsList.firstChild);

    // 重置表單
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewContent').value = '';
    document.querySelectorAll('.stars').forEach(stars => {
        stars.dataset.value = '0';
        Array.from(stars.children).forEach(star => star.innerHTML = '☆');
    });

    // 隱藏表單，顯示"新增課程評論"按鈕
    document.getElementById('addReviewForm').style.display = 'none';
    document.getElementById('addReviewBtn').style.display = 'block';
}

function searchCourses() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    const filteredCourses = courses.filter(course => {
        if (searchType === 'courseName') {
            return course.name.toLowerCase().includes(searchInput);
        } else {
            return course.teacher.toLowerCase().includes(searchInput);
        }
    });

    displayCourses(filteredCourses);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchCourses();
    document.getElementById('searchInput').addEventListener('input', searchCourses);
    document.querySelectorAll('input[name="searchType"]').forEach(radio => {
        radio.addEventListener('change', searchCourses);
    });
});