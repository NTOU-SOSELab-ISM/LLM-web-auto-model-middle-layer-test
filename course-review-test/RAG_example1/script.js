// 初始化景點資訊查詢區
function initializeSearchPage() {
    const attractions = JSON.parse(localStorage.getItem('attractions')) || [];
    const resultsPanel = document.getElementById('resultsPanel');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const addReviewButton = document.getElementById('addReviewButton');
    const reviewForm = document.getElementById('reviewForm');
    const submitReview = document.getElementById('submitReview');
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    let selectedAttractionId = null;

    // 初始化時，給reviewForm中的dataset添加初始值
    reviewForm.dataset.scenery = 0;
    reviewForm.dataset.service = 0;
    reviewForm.dataset.satisfaction = 0;

    // 渲染景點Card
    function renderAttractions(filter = '') {
        resultsPanel.innerHTML = '';
        const filtered = attractions.filter(attr => {
            if (searchType.value === 'name') {
                return attr.name.includes(filter);
            } else {
                return attr.region.includes(filter);
            }
        });

        filtered.forEach(attr => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = attr.id;

            const commentCount = attr.comments.length;
            card.innerHTML = `
                <h3>${attr.name}</h3>
                <div class="region">${attr.region}</div>
                <div class="ratings">
                    <div><span class="label">景色評分：</span><span class="stars">${generateStars(attr.rating.scenery)}</span></div>
                    <div><span class="label">服務評分：</span><span class="stars">${generateStars(attr.rating.service)}</span></div>
                    <div><span class="label">整體滿意度：</span><span class="stars">${generateStars(attr.rating.satisfaction)}</span></div>
                </div>
                <div class="popularity">人氣：${commentCount} 🧑‍🤝‍🧑</div>
            `;
            resultsPanel.appendChild(card);
        });

        if (resultsPanel.childElementCount === 0) {
            resultsPanel.innerHTML = '<p>沒有符合搜尋條件的結果。</p>';
        }
    }

    // 生成星星，根據評分生成對應數量的實心和空心星星
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
        renderAttractions(query);
    });

    // 點擊Card選擇景點
    resultsPanel.addEventListener('click', (e) => {
        let card = e.target.closest('.card');
        if (card) {
            // 取消其他選擇
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedAttractionId = parseInt(card.dataset.id);
            addReviewButton.classList.remove('hidden');
            renderReviews();
        }
    });

    // 新增評論按鈕
    addReviewButton.addEventListener('click', () => {
        reviewForm.classList.toggle('hidden');
    });

// 星星選擇
reviewForm.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const type = e.target.parentElement.dataset.type; // 修正此行
        const stars = e.target.parentElement.children;
        let rating = 0;
        for (let i = 0; i <= Array.from(stars).indexOf(e.target); i++) {
            stars[i].textContent = '★';
            rating++;
        }
        for (let i = rating; i < 5; i++) {
            stars[i].textContent = '☆';
        }
        // 更新 dataset 中的評分
        reviewForm.dataset[type] = rating;  // 確保評分更新正確
    }
});



    // 提交評論
    submitReview.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const scenery = parseInt(reviewForm.dataset.scenery) || 0;
        const service = parseInt(reviewForm.dataset.service) || 0;
        const satisfaction = parseInt(reviewForm.dataset.satisfaction) || 0;

        console.log('Scenery Rating:', scenery); // 測試輸出，確認值是否正確
        console.log('Service Rating:', service); // 測試輸出，確認值是否正確
        console.log('Satisfaction Rating:', satisfaction); // 測試輸出，確認值是否正確

        if (!username || !comment) {
            alert('請填寫所有欄位');
            return;
        }

        const newComment = {
            username,
            comment,
            rating: {
                scenery,
                service,
                satisfaction
            },
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        // 更新資料
        const attraction = attractions.find(attr => attr.id === selectedAttractionId);
        attraction.comments.unshift(newComment);
        // 更新評分平均值
        attraction.rating.scenery = calculateAverage(attraction.comments.map(c => c.rating.scenery));
        attraction.rating.service = calculateAverage(attraction.comments.map(c => c.rating.service));
        attraction.rating.satisfaction = calculateAverage(attraction.comments.map(c => c.rating.satisfaction));

        localStorage.setItem('attractions', JSON.stringify(attractions));
        renderAttractions(searchInput.value.trim());
        renderReviews();
        // reviewForm.reset();
        reviewForm.dataset.scenery = 0;
        reviewForm.dataset.service = 0;
        reviewForm.dataset.satisfaction = 0;
        reviewForm.classList.add('hidden');
    });

    // 計算平均值
    function calculateAverage(arr) {
        if (arr.length === 0) return 0;
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    // 渲染評論
    function renderReviews() {
        reviewsDisplay.innerHTML = '';
        const attraction = attractions.find(attr => attr.id === selectedAttractionId);
        if (attraction) {
            attraction.comments.forEach(c => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `
                    <h4>${c.username} <span class="comment-time">${c.time}</span></h4>
                    <p class="comment-text">${c.comment}</p>
                    <div class="ratings">
                        <div><span class="label">景色評分：</span><span class="stars">${generateStars(c.rating.scenery)}</span></div>
                        <div><span class="label">服務評分：</span><span class="stars">${generateStars(c.rating.service)}</span></div>
                        <div><span class="label">整體滿意度：</span><span class="stars">${generateStars(c.rating.satisfaction)}</span></div>
                    </div>
                `;
                reviewsDisplay.appendChild(commentDiv);
            });
        }
    }

    // 初始渲染
    renderAttractions();
}





// 初始化討論區
function initializeDiscussionPage() {
    const discussions = JSON.parse(localStorage.getItem('discussions')) || [];
    const chatbox = document.getElementById('chatbox');
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const nicknameInput = document.getElementById('nickname');
    const nicknameColor = document.getElementById('nicknameColor');

    // 渲染訊息
    function renderMessages() {
        chatbox.innerHTML = '';
        discussions.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="nickname" style="color:${msg.color}">${msg.username}</span>
                    <span class="time">${msg.time}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            `;
            chatbox.appendChild(messageDiv);
        });
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // 發送訊息
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

    // 事件綁定
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 初始渲染
    renderMessages();
}

// 初始化留言板
function initializeMessagePage() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const messageList = document.getElementById('messageList');
    const postButton = document.getElementById('postMessage');
    const messageContent = document.getElementById('messageContent');
    const messageUsername = document.getElementById('messageUsername');

    // 渲染留言
    function renderMessages() {
        messageList.innerHTML = '';
        messages.forEach(msg => {
            const card = document.createElement('div');
            card.className = 'message-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="username">${msg.username}</span>
                    <span class="time">${msg.time}</span>
                </div>
                <div class="card-content">${msg.content}</div>
            `;
            messageList.appendChild(card);
        });
    }

    // 發表留言
    function postMessage() {
        const username = messageUsername.value.trim();
        const content = messageContent.value.trim();

        if (!username || !content) {
            alert('請填寫所有欄位');
            return;
        }

        const newMessage = {
            username,
            content,
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        messages.unshift(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        renderMessages();
        messageUsername.value = '';
        messageContent.value = '';
    }

    // 事件綁定
    postButton.addEventListener('click', postMessage);

    // 初始渲染
    renderMessages();
}
