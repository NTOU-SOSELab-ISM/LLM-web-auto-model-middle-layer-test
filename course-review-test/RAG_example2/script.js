// 全域變數
let restaurants = [];
let currentRestaurant = null;
let commentsData = [];
let chatMessages = [];
let feedbacks = [];

// 載入初始資料
window.onload = function() {
    // 從JSON檔案載入資料
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data.restaurants;
            commentsData = data.comments;
            chatMessages = data.chatMessages;
            feedbacks = data.feedbacks;
            // 初始化頁面
            initIndexPage();
            initDiscussionPage();
            initFeedbackPage();
        });
};

// 初始化餐廳資訊查詢區
function initIndexPage() {
    if (document.getElementById('restaurantList')) {
        displayRestaurantList(restaurants);
        document.getElementById('searchButton').addEventListener('click', searchRestaurants);
        document.getElementById('addCommentButton').addEventListener('click', showCommentForm);
        document.getElementById('submitComment').addEventListener('click', submitComment);
    }
}

// 顯示餐廳列表
function displayRestaurantList(restaurants) {
    const list = document.getElementById('restaurantList');
    list.innerHTML = '';
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <h3>${restaurant.name}</h3>
            <p>位置：${restaurant.city}</p>
            <div class="ratings">
                <div class="rating-row">
                    <p>菜式多樣性評分：</p>
                    ${generateStars(restaurant.avgDiversity)}
                </div>
                <div class="rating-row">
                    <p>服務評分：</p>
                    ${generateStars(restaurant.avgService)}
                </div>
                <div class="rating-row">
                    <p>價格合理度：</p>
                    ${generateStars(restaurant.avgPrice)}
                </div>
            </div>
            <div class="popularity">
                <p>人氣值：${restaurant.popularity} <i class="fas fa-fire" style="color: orange;"></i></p>
            </div>
        `;
        card.addEventListener('click', () => {
            selectRestaurant(card, restaurant);
        });
        list.appendChild(card);
    });
}

// 產生星星評分
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// 選擇餐廳
function selectRestaurant(card, restaurant) {
    const cards = document.querySelectorAll('.restaurant-card');
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentRestaurant = restaurant;
    displayComments(restaurant.id);
}

// 顯示評論
function displayComments(restaurantId) {
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.innerHTML = '';
    const restaurantComments = commentsData.filter(comment => comment.restaurantId === restaurantId);
    restaurantComments.reverse().forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        commentCard.innerHTML = `
            <h4>${comment.userName}</h4>
            <p>${comment.content}</p>
            <div class="ratings">
                <div class="rating-row">
                    <p>菜式多樣性評分：</p>
                    ${generateStars(comment.diversityRating)}
                </div>
                <div class="rating-row">
                    <p>服務評分：</p>
                    ${generateStars(comment.serviceRating)}
                </div>
                <div class="rating-row">
                    <p>價格合理度：</p>
                    ${generateStars(comment.priceRating)}
                </div>
            </div>
            <p>${comment.time}</p>
        `;
        commentsSection.appendChild(commentCard);
    });
}

// 顯示新增評論表單
function showCommentForm() {
    if (currentRestaurant) {
        document.getElementById('commentForm').style.display = 'block';
        initStarRatings();
    } else {
        alert('請先選擇一家餐廳');
    }
}

// 初始化星星評分
function initStarRatings() {
    ['diversityRating', 'serviceRating', 'priceRating'].forEach(id => {
        const container = document.getElementById(id);
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = 'far fa-star';
            star.dataset.value = i;
            star.addEventListener('click', function() {
                const stars = container.querySelectorAll('i');
                stars.forEach(s => s.className = 'far fa-star');
                for (let j = 0; j < i; j++) {
                    stars[j].className = 'fas fa-star';
                }
                container.dataset.rating = i;
            });
            container.appendChild(star);
        }
        container.dataset.rating = 0;
    });
}

// 提交評論
function submitComment() {
    const userName = document.getElementById('userName').value;
    const content = document.getElementById('commentContent').value;
    const diversityRating = parseInt(document.getElementById('diversityRating').dataset.rating);
    const serviceRating = parseInt(document.getElementById('serviceRating').dataset.rating);
    const priceRating = parseInt(document.getElementById('priceRating').dataset.rating);

    if (!userName || !content || !diversityRating || !serviceRating || !priceRating) {
        alert('請填寫完整的評論資訊');
        return;
    }

    const newComment = {
        restaurantId: currentRestaurant.id,
        userName,
        content,
        diversityRating,
        serviceRating,
        priceRating,
        time: new Date().toLocaleString()
    };

    commentsData.push(newComment);
    updateJSONData();
    displayComments(currentRestaurant.id);
    document.getElementById('commentForm').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('commentContent').value = '';
}

// 更新JSON資料（模擬）
function updateJSONData() {
    // 在真實情況下，這裡會發送請求到伺服器，更新資料庫或JSON檔案
    console.log('資料已更新', commentsData, chatMessages, feedbacks);
}

// 搜尋餐廳
function searchRestaurants() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.querySelector('input[name="filter"]:checked').value;
    let filteredRestaurants = restaurants;

    if (keyword) {
        filteredRestaurants = restaurants.filter(restaurant => {
            if (filter === 'name') {
                return restaurant.name.toLowerCase().includes(keyword);
            } else {
                return restaurant.cuisine.toLowerCase().includes(keyword);
            }
        });
    }

    displayRestaurantList(filteredRestaurants);
}

// 初始化美食討論區
function initDiscussionPage() {
    if (document.getElementById('chatMessages')) {
        displayChatMessages();
        document.getElementById('sendChat').addEventListener('click', sendChatMessage);
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}
// 初始化美食討論區
function initDiscussionPage() {
    if (document.getElementById('chatMessages')) {
        displayChatMessages();
        document.getElementById('sendChat').addEventListener('click', sendChatMessage);
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

// 顯示聊天訊息
function displayChatMessages() {
    const chatMessagesDiv = document.getElementById('chatMessages');
    chatMessagesDiv.innerHTML = '';
    chatMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <p style="color: ${message.color};"><strong>${message.userName}</strong> (${message.time}):</p>
            <p>${message.content}</p>
        `;
        chatMessagesDiv.appendChild(messageDiv);
    });
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

// 發送聊天訊息
function sendChatMessage() {
    const userName = document.getElementById('chatUserName').value;
    const color = document.getElementById('userColor').value;
    const content = document.getElementById('chatInput').value;

    if (!userName || !content) {
        alert('請填寫使用者暱稱和訊息內容');
        return;
    }

    const newMessage = {
        userName,
        color,
        content,
        time: new Date().toLocaleTimeString()
    };

    chatMessages.push(newMessage);
    updateJSONData();
    displayChatMessages();
    document.getElementById('chatInput').value = '';
}

// 初始化食客意見區
function initFeedbackPage() {
    if (document.getElementById('feedbackList')) {
        displayFeedbacks();
        document.getElementById('addFeedbackButton').addEventListener('click', showFeedbackForm);
        document.getElementById('submitFeedback').addEventListener('click', submitFeedback);
    }
}

// 顯示留言
function displayFeedbacks() {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';
    feedbacks.reverse().forEach(feedback => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
            <h4>${feedback.userName}</h4>
            <p>${feedback.content}</p>
            <p>${feedback.time}</p>
        `;
        feedbackList.appendChild(card);
    });
}

// 顯示留言表單
function showFeedbackForm() {
    document.getElementById('feedbackForm').style.display = 'block';
    document.getElementById('addFeedbackButton').style.display = 'none';
    document.getElementById('feedbackUserName').value = '';
    document.getElementById('feedbackContent').value = '';
}

// 提交留言
function submitFeedback() {
    const userName = document.getElementById('feedbackUserName').value;
    const content = document.getElementById('feedbackContent').value;

    if (!userName || !content) {
        alert('請填寫使用者名稱和留言內容');
        return;
    }

    const newFeedback = {
        userName,
        content,
        time: new Date().toLocaleString()
    };

    feedbacks.push(newFeedback);
    updateJSONData();
    displayFeedbacks();
    document.getElementById('feedbackForm').style.display = 'none';
    document.getElementById('addFeedbackButton').style.display = 'block';
}

// 更新JSON資料（模擬）
function updateJSONData() {
    // 在真實情況下，這裡會發送請求到伺服器，更新資料庫或JSON檔案
    console.log('資料已更新', commentsData, chatMessages, feedbacks);
}

