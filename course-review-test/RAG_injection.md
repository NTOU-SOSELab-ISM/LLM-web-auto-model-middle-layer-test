以下是有關於使用html, css, javascript撰寫的三個有複雜UI/UX的網頁程式碼專案，其中每個專案會有使用者的需求和對應需求所產生的完整程式碼檔案，以下是內文:

# 範例專案1: 旅遊景點評論網站

## User prompts
我要使用html、css、javascript做一個網頁，是一個旅遊景點評論網站，以下是詳細需求：

網頁結構 要有三個頁面的html檔案，分別為「景點資訊查詢區」、「討論區」、「留言板」，並且生出相對應的處理樣式、按鍵互動及排版。

景點資訊查詢區的要求1 上方header為深藍色背景，有三個選項：「景點資訊查詢區」、「討論區」、「留言板」，點擊可進行頁面跳轉，這三個選項需位於header的右側，左側則放置一個icon圖案＋「旅遊景點評論網」字樣。

景點資訊查詢區的要求2 在header下方為淺藍底頁面，有一個輸入框可以輸入關鍵字，輸入框右側可以選擇「依景點名稱查詢」或「依地區查詢」。搜尋列左上角顯示「使用關鍵字查詢」的字樣。篩選部分用javascript處理。

景點資訊查詢區的要求3 頁面中分成左右兩部分，左側顯示篩選結果，每個景點資訊會呈現在一個card物件上，顯示景點名稱、地區、評價、人氣。Card的左上方顯示景點名稱，右上顯示地區，左下顯示景點評價，有三列分別顯示「景色評分」、「服務評分」、「整體滿意度」，每列後有五顆星星icon，顯示每個評分的平均值。右下顯示人氣數字及icon。

景點資訊查詢區的要求4 點擊左側的card，該card會被深藍色外框標示，右側顯示「新增景點評論」按鈕，按下後進入新增評論模式。在新增評論模式下，出現五個輸入框：「輸入使用者名稱」、「輸入評論」、「輸入景色評分」、「輸入服務評分」、「輸入整體滿意度」，每項評分皆有五個星星icon供選擇。新增評論後，按下「提交」按鈕，評論會被更新到該景點下，且最新評論顯示在最上方。

討論區的要求1 深藍色header設計和景點資訊查詢區相同，但切換頁面時文字會高亮，非當前頁文字會變暗。

討論區的要求2 討論區頁面為淺藍背景，有一個聊天室，使用者可留言互動。聊天室下方有輸入區，可選擇暱稱顏色、輸入暱稱及訊息。每則訊息需記錄發送時間、使用者暱稱及顏色，並顯示在聊天室中。訊息送出可透過按下發送按鈕或按Enter鍵。

留言板的要求 與討論區類似，但只顯示每位使用者對網站或景點的留言，留言以card形式呈現，左上顯示使用者名稱，卡片中間為留言內容，右下顯示留言時間。

假資料需求 景點資訊查詢區初始須生成至少六個景點，每個景點須有五個以上使用者的評論。所有資料須用JSON格式存儲。 討論區需生成至少三個使用者，並有十則歷史訊息，這些訊息需用JSON格式存儲。 留言板需生成三則初始留言，內容自由生成，並存為JSON。 UI需求 頁面設計應以美觀為主，顏色及圓角部分的設計與前述一致。頁面滾動及互動性須流暢，且所有新增的評論或留言皆需更新至對應的JSON資料。 給我完整符合需求的程式碼和fake data

## index.html

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>旅遊景點評論網 - 景點資訊查詢區</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="header-left">
            <span class="logo-icon">🗺️</span>
            <span class="site-title">旅遊景點評論網</span>
        </div>
        <div class="header-right">
            <a href="index.html" class="nav-link active">景點資訊查詢區</a>
            <a href="discussion.html" class="nav-link">討論區</a>
            <a href="message.html" class="nav-link">留言板</a>
        </div>
    </header>

    <div class="search-section">
        <h2>使用關鍵字查詢</h2>
        <div class="search-bar">
            <input type="text" id="searchInput" placeholder="輸入關鍵字...">
            <select id="searchType">
                <option value="name">依景點名稱查詢</option>
                <option value="region">依地區查詢</option>
            </select>
            <button id="searchButton">搜尋</button>
        </div>
    </div>

    <div class="content">
        <div class="left-panel" id="resultsPanel">
            <!-- 景點Card將動態生成 -->
        </div>
        <div class="right-panel" id="detailPanel">
            <button id="addReviewButton" class="hidden">新增景點評論</button>
            <div id="reviewForm" class="hidden">
                <h3>新增評論</h3>
                <input type="text" id="username" placeholder="輸入使用者名稱">
                <textarea id="comment" placeholder="輸入評論"></textarea>
                <div class="rating">
                    <label>景色評分：</label>
                    <div class="stars" data-type="scenery">
                        <span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span>
                    </div>
                </div>
                <div class="rating">
                    <label>服務評分：</label>
                    <div class="stars" data-type="service">
                        <span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span>
                    </div>
                </div>
                <div class="rating">
                    <label>整體滿意度：</label>
                    <div class="stars" data-type="satisfaction">
                        <span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span><span class="star">☆</span>
                    </div>
                </div>
                <button id="submitReview">提交</button>
            </div>
            <div id="reviewsDisplay">
                <!-- 評論將動態生成 -->
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // 初始化景點資訊
        fetch('data/attractions.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('attractions', JSON.stringify(data));
                initializeSearchPage();
            })
            .catch(error => console.error('無法載入景點資訊:', error));
    </script>
</body>
</html>
```
## discussion.html

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>旅遊景點評論網 - 討論區</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="header-left">
            <img src="icon.png" alt="Icon" class="logo-icon">
            <span class="site-title">旅遊景點評論網</span>
        </div>
        <div class="header-right">
            <a href="index.html" class="nav-link">景點資訊查詢區</a>
            <a href="discussion.html" class="nav-link active">討論區</a>
            <a href="message.html" class="nav-link">留言板</a>
        </div>
    </header>

    <div class="discussion-section">
        <div class="chatbox" id="chatbox">
            <!-- 訊息將動態生成 -->
        </div>
        <div class="input-area">
            <input type="color" id="nicknameColor" value="#000000">
            <input type="text" id="nickname" placeholder="輸入暱稱">
            <input type="text" id="messageInput" placeholder="輸入訊息">
            <button id="sendMessage">發送</button>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // 初始化討論區資料
        const discussionsData = [
            {
                "username": "Bob",
                "color": "#ff0000",
                "message": "大家好！這個網站很棒！",
                "time": "2024-04-01 09:00"
            },
            // 至少十則訊息...
        ];

        // 檢查並初始化localStorage
        if (!localStorage.getItem('discussions')) {
            localStorage.setItem('discussions', JSON.stringify(discussionsData));
        }

        // 呼叫初始化函式
        initializeDiscussionPage();
    </script>
</body>
</html>
```

## message.html

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>旅遊景點評論網 - 留言板</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="header-left">
            <img src="icon.png" alt="Icon" class="logo-icon">
            <span class="site-title">旅遊景點評論網</span>
        </div>
        <div class="header-right">
            <a href="index.html" class="nav-link">景點資訊查詢區</a>
            <a href="discussion.html" class="nav-link">討論區</a>
            <a href="message.html" class="nav-link active">留言板</a>
        </div>
    </header>

    <div class="message-board">
        <div class="messages" id="messageList">
            <!-- 留言將動態生成 -->
        </div>
        <div class="input-area">
            <input type="text" id="messageUsername" placeholder="輸入使用者名稱">
            <textarea id="messageContent" placeholder="輸入留言內容"></textarea>
            <button id="postMessage">發表留言</button>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // 初始化留言板資料
        const messagesData = [
            {
                "username": "Charlie",
                "content": "這個網站真的很有用！",
                "time": "2024-04-01 08:30"
            },
            // 至少三則留言...
        ];

        // 檢查並初始化localStorage
        if (!localStorage.getItem('messages')) {
            localStorage.setItem('messages', JSON.stringify(messagesData));
        }

        // 呼叫初始化函式
        initializeMessagePage();
    </script>
</body>
</html>
```

## styles.css

```css
/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Header */
header {
    background-color: #003366;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
}

.header-left {
    display: flex;
    align-items: center;
}

.logo-icon {
    font-size: 1.5em;
    margin-right: 10px;
}

.site-title {
    font-size: 1.5em;
    font-weight: bold;
}

.header-right .nav-link {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    font-size: 1em;
    transition: color 0.3s;
}

.header-right .nav-link:hover {
    color: #cccccc;
}

.header-right .active {
    color: #ffcc00;
}

/* Search Section */
.search-section {
    background-color: #cce6ff;
    padding: 20px;
}

.search-section h2 {
    margin-bottom: 10px;
}

.search-bar {
    display: flex;
    align-items: center;
}

#searchInput {
    flex: 1;
    padding: 10px;
    border: 1px solid #999;
    border-radius: 5px 0 0 5px;
    outline: none;
}

#searchType {
    padding: 10px;
    border: 1px solid #999;
    border-left: none;
    outline: none;
}

#searchButton {
    padding: 10px 20px;
    border: none;
    background-color: #003366;
    color: white;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
}

#searchButton:hover {
    background-color: #002244;
}

/* Content */
.content {
    display: flex;
    padding: 20px;
    height: calc(100vh - 60px);
}

.left-panel, .right-panel {
    width: 50%;
    overflow-y: auto;
    background-color: #e6f7ff;
    padding: 20px;
    border: 1px solid #999;
    border-radius: 10px;
}

.left-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    background-color: white;
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 15px;
    width: 100%;
    cursor: pointer;
    transition: border 0.3s, height 0.3s;
}

.card.selected {
    border: 2px solid #003366;
}

.card h3 {
    margin-bottom: 5px;
}

.card .region {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 10px;
}

.card .ratings {
    margin-bottom: 10px;
}

.card .ratings div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.card .ratings .label {
    width: 120px;
}

.card .ratings .stars span {
    color: gold;
    margin-right: 2px;
}
.stars span {
    font-size: 1.2em;
    color: gold;
    cursor: pointer;
}



.card .popularity {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #333;
}

.card .popularity img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}

.card .popularity .icon {
    margin-left: 10px;
    font-size: 1.2em;
}

/* Right Panel */
.right-panel {
    padding-left: 20px;
    border-left: 1px solid #ccc;
}

.hidden {
    display: none;
}

#addReviewButton {
    padding: 10px 20px;
    background-color: #003366;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#addReviewButton:hover {
    background-color: #002244;
}

#reviewForm {
    margin-top: 20px;
}

#reviewForm input, #reviewForm textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #999;
    border-radius: 5px;
}

#reviewForm textarea {
    resize: vertical;
    height: 80px;
}

.rating {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.rating label {
    width: 120px;
}

.stars span {
    font-size: 1.2em;
    color: gold;
    cursor: pointer;
}

#submitReview {
    padding: 10px 20px;
    background-color: #ffcc00;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#submitReview:hover {
    background-color: #e6b800;
}

#reviewsDisplay {
    margin-top: 20px;
}

.comment {
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.comment h4 {
    margin-bottom: 5px;
}

.comment .comment-text {
    margin-bottom: 5px;
}

.comment .comment-time {
    font-size: 0.8em;
    color: #666;
}


/* Discussion Section */
.discussion-section {
    padding: 20px;
    background-color: #cce6ff;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
}

.chatbox {
    flex: 1;
    background-color: white;
    border: 1px solid #999;
    border-radius: 10px;
    padding: 10px;
    overflow-y: scroll;
    margin-bottom: 10px;
}

.message {
    margin-bottom: 10px;
}

.message .message-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.message .message-header .nickname {
    font-weight: bold;
    margin-right: 10px;
}

.message .message-header .time {
    font-size: 0.8em;
    color: #666;
}

.input-area {
    display: flex;
    align-items: center;
}

.input-area input[type="color"] {
    margin-right: 10px;
}

.input-area input[type="text"] {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #999;
    border-radius: 5px;
    outline: none;
}

.input-area textarea {
    flex: 1;
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #999;
    border-radius: 5px;
    resize: vertical;
    height: 50px;
}

#sendMessage {
    padding: 10px 20px;
    background-color: #003366;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#sendMessage:hover {
    background-color: #002244;
}

/* Message Board */
.message-board {
    padding: 20px;
    background-color: #cce6ff;
    min-height: calc(100vh - 60px);
}

.messages {
    margin-bottom: 20px;
}

.message-card {
    background-color: white;
    border: 1px solid #999;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
}

.message-card .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.message-card .card-header .username {
    font-weight: bold;
}

.message-card .card-header .time {
    font-size: 0.8em;
    color: #666;
}

.message-card .card-content {
    font-size: 1em;
}

/* Scrollbar Styling */
.chatbox::-webkit-scrollbar, .left-panel::-webkit-scrollbar, .messages::-webkit-scrollbar {
    width: 8px;
}

.chatbox::-webkit-scrollbar-thumb, .left-panel::-webkit-scrollbar-thumb, .messages::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 4px;
}

.chatbox::-webkit-scrollbar-thumb:hover, .left-panel::-webkit-scrollbar-thumb:hover, .messages::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
```

## script.js

```javascript
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
```

## data/attractions.json

```json
[
    {
        "id": 1,
        "name": "台北101",
        "region": "台北市",
        "rating": {
            "scenery": 4,
            "service": 5,
            "satisfaction": 5
        },
        "popularity": 5000,
        "comments": [
            {
                "username": "Alice",
                "comment": "景色非常壯觀，服務也很好！",
                "rating": {
                    "scenery": 5,
                    "service": 5,
                    "satisfaction": 5
                },
                "time": "2024-04-01 10:00"
            },
            {
                "username": "Bob",
                "comment": "台北101的夜景令人驚豔。",
                "rating": {
                    "scenery": 4,
                    "service": 4,
                    "satisfaction": 4
                },
                "time": "2024-04-02 12:30"
            },
            {
                "username": "Charlie",
                "comment": "人太多，等候時間長。",
                "rating": {
                    "scenery": 3,
                    "service": 4,
                    "satisfaction": 3
                },
                "time": "2024-04-03 14:15"
            },
            {
                "username": "Daisy",
                "comment": "觀景台的設施很完善。",
                "rating": {
                    "scenery": 5,
                    "service": 5,
                    "satisfaction": 5
                },
                "time": "2024-04-04 09:45"
            },
            {
                "username": "Ethan",
                "comment": "購物中心選擇豐富。",
                "rating": {
                    "scenery": 4,
                    "service": 5,
                    "satisfaction": 4
                },
                "time": "2024-04-05 11:20"
            }
        ]
    },
    {
        "id": 2,
        "name": "日月潭",
        "region": "南投縣",
        "rating": {
            "scenery": 5,
            "service": 4,
            "satisfaction": 5
        },
        "popularity": 3000,
        "comments": [
            {
                "username": "Fiona",
                "comment": "風景如畫，適合放鬆心情。",
                "rating": {
                    "scenery": 5,
                    "service": 4,
                    "satisfaction": 5
                },
                "time": "2024-04-06 08:30"
            },
            {
                "username": "Grace",
                "comment": "搭船遊湖很有趣。",
                "rating": {
                    "scenery": 4,
                    "service": 4,
                    "satisfaction": 4
                },
                "time": "2024-04-07 10:00"
            },
            {
                "username": "Henry",
                "comment": "美食選擇多樣。",
                "rating": {
                    "scenery": 4,
                    "service": 5,
                    "satisfaction": 4
                },
                "time": "2024-04-08 12:00"
            },
            {
                "username": "Ivy",
                "comment": "交通不便利，需自行開車。",
                "rating": {
                    "scenery": 5,
                    "service": 3,
                    "satisfaction": 4
                },
                "time": "2024-04-09 14:00"
            },
            {
                "username": "Jack",
                "comment": "住宿選擇有限。",
                "rating": {
                    "scenery": 4,
                    "service": 3,
                    "satisfaction": 3
                },
                "time": "2024-04-10 16:00"
            }
        ]
    },
    {
        "id": 3,
        "name": "墾丁",
        "region": "屏東縣",
        "rating": {
            "scenery": 4,
            "service": 3,
            "satisfaction": 4
        },
        "popularity": 2000,
        "comments": [
            {
                "username": "Kevin",
                "comment": "海灘很美，適合玩水。",
                "rating": {
                    "scenery": 5,
                    "service": 4,
                    "satisfaction": 5
                },
                "time": "2024-04-11 08:30"
            },
            {
                "username": "Lily",
                "comment": "水上活動很刺激。",
                "rating": {
                    "scenery": 4,
                    "service": 3,
                    "satisfaction": 4
                },
                "time": "2024-04-12 10:00"
            },
            {
                "username": "Mike",
                "comment": "太陽很大，要做好防曬。",
                "rating": {
                    "scenery": 4,
                    "service": 3,
                    "satisfaction": 4
                },
                "time": "2024-04-13 12:00"
            },
            {
                "username": "Nancy",
                "comment": "夜市很熱鬧。",
                "rating": {
                    "scenery": 3,
                    "service": 3,
                    "satisfaction": 3
                },
                "time": "2024-04-14 14:00"
            },
            {
                "username": "Oscar",
                "comment": "交通不便利，需自行開車。",
                "rating": {
                    "scenery": 4,
                    "service": 3,
                    "satisfaction": 4
                },
                "time": "2024-04-15 16:00"
            }
        ]
    }
]

```







## data/discussions.json
```json
[
    {
        "username": "Bob",
        "color": "#ff0000",
        "message": "大家好！這個網站很棒！",
        "time": "2024-04-01 09:00"
    },
    {
        "username": "Alice",
        "color": "#0000ff",
        "message": "我剛剛在台北101新增了一條評論。",
        "time": "2024-04-01 09:15"
    },
    {
        "username": "Charlie",
        "color": "#00ff00",
        "message": "有人去過日月潭嗎？",
        "time": "2024-04-01 09:30"
    }
]

```

## data/messages.json

```json
[
    {
        "username": "Charlie",
        "content": "這個網站真的很有用！",
        "time": "2024-04-01 08:30"
    },
    {
        "username": "Daisy",
        "content": "我喜歡這個網站的設計！",
        "time": "2024-04-01 09:00"
    },
    {
        "username": "Ethan",
        "content": "希望能新增更多景點資訊。",
        "time": "2024-04-01 09:30"
    },
    {
        "username": "Fiona",
        "content": "我在這裡找到了我想要的資訊！",
        "time": "2024-04-01 10:00"
    }
]

```

# 範例專案2: 美食餐廳評論網站

## User prompts

我要使用html、css、javascript來設計一個美食餐廳評論網站，以下是詳細需求：

網頁結構 此網站包含三個主要頁面：「餐廳資訊查詢區」、「美食討論區」和「食客意見區」，每個頁面需要對應的互動設計與排版樣式。

餐廳資訊查詢區的要求1 頁面頂部的header區域為深紅色背景，右側設有三個可點擊選項：「餐廳資訊查詢區」、「美食討論區」、「食客意見區」。點擊選項後將執行頁面跳轉，左側顯示一個餐廳圖標和網站名稱「美食餐廳評價網」。

餐廳資訊查詢區的要求2 header下方是淺米黃色背景，並顯示搜尋欄。使用者可輸入餐廳名稱或美食關鍵字進行查詢，右側有兩個篩選條件：「依餐廳名稱查詢」和「依菜式查詢」。搜尋框上方會顯示「輸入關鍵字查詢餐廳」的提示文字，篩選條件部分需使用JavaScript實現。

餐廳資訊查詢區的要求3 頁面主體分為左右兩部分，左側顯示根據查詢結果篩選出的餐廳資訊，每個餐廳資訊呈現在card物件內。每個card會顯示「餐廳名稱」、「位置」、「平均評價」、「人氣值」。card的左上顯示餐廳名稱，右上顯示餐廳所在城市，左下部分有三列顯示分別為：「菜式多樣性評分」、「服務評分」、「價格合理度」，每列旁都有五顆星星圖示，星星數量根據平均評分來顯示。右下顯示人氣數及一個火焰icon。

餐廳資訊查詢區的要求4 點擊左側的某個餐廳card後，該餐廳的card外框會變為深紅色，代表目前選中的項目。右側會顯示「新增餐廳評論」按鈕，點擊後進入評論新增模式。新增模式下會顯示五個輸入框：「使用者名稱」、「評論內容」、「菜式多樣性評分」、「服務評分」、「價格合理度」，評分項目以五顆星星表示。提交後，新評論會顯示在該餐廳的評論區域，並且最新的評論會顯示在最上方。按下提交後會返回餐廳資訊展示模式。

美食討論區的要求1 header部分與餐廳資訊查詢區一致，但當前頁的選項文字會變亮，其他選項會變暗。

美食討論區的要求2 頁面淺米黃色背景，主區域是一個類似論壇的討論區。討論區上方顯示最新討論話題及熱門餐廳推薦，下方是一個聊天室。聊天室左側有顏色選擇、使用者暱稱輸入框及訊息輸入框。訊息發送時需記錄使用者的暱稱、顏色、發送時間及訊息內容，並按順序顯示在聊天室中。訊息可以通過按下「發送」按鈕或Enter鍵發送。

食客意見區的要求 **「食客意見區」**主要是供使用者留下對網站或餐廳的總體意見和建議。每位使用者的留言會以白底card樣式呈現，左上顯示使用者名稱，卡片中間顯示使用者的留言內容，右下則顯示留言時間。新增留言按鈕位於頁面右側，點擊後可顯示留言輸入框及「提交」按鈕，提交後留言會顯示在留言區的最上方。

假資料需求 餐廳資訊查詢區須生成至少八個餐廳的假資料，每個餐廳須有四個以上使用者的評論。所有評論和餐廳資料需用JSON格式存儲。 美食討論區需生成至少五名不同的使用者，並且初始有十二則歷史討論訊息，這些訊息也需用JSON格式存儲。 食客意見區需生成至少三條初始意見或建議，並且存為JSON格式。 UI設計需求 頁面設計以直觀、美觀為主，深紅和淺米黃為主色調，並保持各區域流暢的滾動和互動性。所有新增的評論、訊息和留言都需及時更新至對應的JSON資料中。



## index.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>美食餐廳評價網 - 餐廳資訊查詢區</title>
    <link rel="stylesheet" href="style.css">
    <!-- 引入 Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header 區域 -->
    <header>
        <div class="logo">
            <i class="fas fa-utensils fa-2x"></i>
            <h1>美食餐廳評價網</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.html" class="active">餐廳資訊查詢區</a></li>
                <li><a href="discussion.html">美食討論區</a></li>
                <li><a href="feedback.html">食客意見區</a></li>
            </ul>
        </nav>
    </header>

    <!-- 搜尋區域 -->
    <section class="search-area">
        <p>輸入關鍵字查詢餐廳</p>
        <input type="text" id="searchInput" placeholder="輸入餐廳名稱或美食關鍵字">
        <div class="filter-options">
            <label><input type="radio" name="filter" value="name" checked>依餐廳名稱查詢</label>
            <label><input type="radio" name="filter" value="cuisine">依菜式查詢</label>
        </div>
        <button id="searchButton">搜尋</button>
    </section>

    <!-- 主體區域 -->
    <main>
        <div class="left-panel" id="restaurantList">
            <!-- 餐廳卡片將由JavaScript動態生成 -->
        </div>
        <div class="right-panel" id="restaurantDetails">
            <!-- 餐廳詳細資訊和評論區 -->
            <div id="commentsSection">
                <!-- 評論將由JavaScript動態生成 -->
            </div>
            <button id="addCommentButton">新增餐廳評論</button>
            <div id="commentForm" style="display: none;">
                <h3>新增評論</h3>
                <input type="text" id="userName" placeholder="使用者名稱">
                <textarea id="commentContent" placeholder="評論內容"></textarea>
                <div class="rating">
                    <p>菜式多樣性評分：</p>
                    <div id="diversityRating" class="star-rating"></div>
                </div>
                <div class="rating">
                    <p>服務評分：</p>
                    <div id="serviceRating" class="star-rating"></div>
                </div>
                <div class="rating">
                    <p>價格合理度：</p>
                    <div id="priceRating" class="star-rating"></div>
                </div>
                <button id="submitComment">提交</button>
            </div>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
```

## discussion.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>美食餐廳評價網 - 美食討論區</title>
    <link rel="stylesheet" href="style.css">
    <!-- 引入 Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header 區域 -->
    <header>
        <div class="logo">
            <i class="fas fa-utensils fa-2x"></i>
            <h1>美食餐廳評價網</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.html">餐廳資訊查詢區</a></li>
                <li><a href="discussion.html" class="active">美食討論區</a></li>
                <li><a href="feedback.html">食客意見區</a></li>
            </ul>
        </nav>
    </header>

    <!-- 主體區域 -->
    <main class="discussion-area">
        <section class="chat-room">
            <div class="chat-controls">
                <input type="color" id="userColor" value="#000000">
                <input type="text" id="chatUserName" placeholder="使用者暱稱">
            </div>
            <div class="chat-messages" id="chatMessages">
                <!-- 聊天訊息將由JavaScript動態生成 -->
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="輸入訊息，按Enter鍵發送">
                <button id="sendChat">發送</button>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
```

## feedback.html
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>美食餐廳評價網 - 美食討論區</title>
    <link rel="stylesheet" href="style.css">
    <!-- 引入 Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header 區域 -->
    <header>
        <div class="logo">
            <i class="fas fa-utensils fa-2x"></i>
            <h1>美食餐廳評價網</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.html">餐廳資訊查詢區</a></li>
                <li><a href="discussion.html" class="active">美食討論區</a></li>
                <li><a href="feedback.html">食客意見區</a></li>
            </ul>
        </nav>
    </header>

    <!-- 主體區域 -->
    <main class="discussion-area">
        <section class="chat-room">
            <div class="chat-controls">
                <input type="color" id="userColor" value="#000000">
                <input type="text" id="chatUserName" placeholder="使用者暱稱">
            </div>
            <div class="chat-messages" id="chatMessages">
                <!-- 聊天訊息將由JavaScript動態生成 -->
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="輸入訊息，按Enter鍵發送">
                <button id="sendChat">發送</button>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
```


## style.css

```css
/* 全域樣式 */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5dc; /* 淺米黃色背景 */
}

header {
    background-color: #8B0000; /* 深紅色背景 */
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
}

.logo {
    display: flex;
    align-items: center;
}

.logo i {
    margin-right: 10px;
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
}

nav li {
    margin: 0 10px;
}

nav a {
    color: #ccc;
    text-decoration: none;
    font-size: 18px;
}

nav a.active {
    color: white;
}

nav a:hover {
    color: white;
}

/* 搜尋區域 */
.search-area {
    padding: 20px;
    text-align: center;
}

.search-area p {
    font-size: 20px;
}

.search-area input[type="text"] {
    width: 300px;
    padding: 10px;
    font-size: 16px;
}

.filter-options {
    margin: 10px 0;
}

.filter-options label {
    margin: 0 10px;
    font-size: 16px;
}

#searchButton {
    padding: 10px 20px;
    font-size: 16px;
}

/* 主體區域 */
main {
    display: flex;
    padding: 20px;
}

.left-panel {
    width: 50%;
    padding-right: 10px;
    overflow-y: auto;
    max-height: 600px;
}

.right-panel {
    width: 50%;
    padding-left: 10px;
    overflow-y: auto;
    max-height: 600px;
}

.restaurant-card {
    background-color: white;
    border: 2px solid #ccc;
    margin-bottom: 10px;
    padding: 10px;
    cursor: pointer;
}

.restaurant-card.selected {
    border-color: #8B0000; /* 深紅色外框 */
}

.restaurant-card h3 {
    margin: 0;
}

.restaurant-card .ratings {
    margin-top: 10px;
}

.rating-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.rating-row p {
    margin: 0;
    margin-right: 5px;
}

.star-rating {
    display: inline-block;
}

.star-rating i {
    color: #ccc;
    margin-right: 2px;
}

.star-rating .fas {
    color: #FFD700; /* 金色 */
}

#addCommentButton {
    padding: 10px 20px;
    font-size: 16px;
    margin-top: 20px;
}

#commentForm {
    background-color: white;
    padding: 20px;
    margin-top: 10px;
}

#commentForm input[type="text"],
#commentForm textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
}

#commentForm .rating {
    margin-bottom: 10px;
}

#commentForm .star-rating i {
    cursor: pointer;
    font-size: 24px;
}

#submitComment {
    padding: 10px 20px;
    font-size: 16px;
}

/* 評論區 */
#commentsSection {
    margin-top: 20px;
}

.comment-card {
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.comment-card h4 {
    margin: 0 0 5px 0;
}

.comment-card .ratings {
    margin-top: 10px;
}

.comment-card p {
    margin: 5px 0;
}

/* 美食討論區樣式 */
.discussion-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.chat-room {
    background-color: #fff;
    padding: 20px;
    width: 60%;
    max-width: 800px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 70px - 40px); /* 減去 header 和 padding 的高度 */
}

.chat-controls {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.chat-controls input[type="text"] {
    margin-left: 10px;
    padding: 5px;
}

.chat-messages {
    border: 1px solid #ccc;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f9f9f9;
}

.chat-message {
    margin-bottom: 10px;
}

.chat-input {
    display: flex;
    margin-top: 10px;
}

.chat-input input[type="text"] {
    flex: 1;
    padding: 10px;
}

#sendChat {
    padding: 10px 20px;
}

/* 食客意見區樣式 */
.feedback-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

#feedbackList {
    width: 60%;
    max-width: 800px;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-bottom: 10px;
}

.feedback-card {
    background-color: white;
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;
    box-sizing: border-box;
}

.feedback-card h4 {
    margin: 0 0 5px 0;
}

.feedback-card p {
    margin: 5px 0;
}

#addFeedbackButton {
    padding: 10px 20px;
    font-size: 16px;
    margin-bottom: 10px;
}

#feedbackForm {
    background-color: #fff;
    padding: 20px;
    width: 60%;
    max-width: 800px;
    box-sizing: border-box;
}

#feedbackForm input[type="text"],
#feedbackForm textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
}

#submitFeedback {
    padding: 10px 20px;
    font-size: 16px;
}
```

## script.js

```javascript

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

```

## data.json

```json
{
    "restaurants": [
        {
            "id": 1,
            "name": "美味餐廳A",
            "city": "台北",
            "cuisine": "中式",
            "avgDiversity": 4,
            "avgService": 5,
            "avgPrice": 3,
            "popularity": 120
        },
        {
            "id": 2,
            "name": "風味餐廳B",
            "city": "高雄",
            "cuisine": "日式",
            "avgDiversity": 5,
            "avgService": 4,
            "avgPrice": 4,
            "popularity": 98
        },
        {
            "id": 3,
            "name": "特色餐廳C",
            "city": "台中",
            "cuisine": "西式",
            "avgDiversity": 3,
            "avgService": 3,
            "avgPrice": 5,
            "popularity": 150
        },
        {
            "id": 4,
            "name": "小吃店D",
            "city": "台南",
            "cuisine": "台式",
            "avgDiversity": 4,
            "avgService": 4,
            "avgPrice": 4,
            "popularity": 80
        },
        {
            "id": 5,
            "name": "咖啡館E",
            "city": "新竹",
            "cuisine": "飲品",
            "avgDiversity": 5,
            "avgService": 5,
            "avgPrice": 3,
            "popularity": 110
        },
        {
            "id": 6,
            "name": "燒烤店F",
            "city": "花蓮",
            "cuisine": "韓式",
            "avgDiversity": 3,
            "avgService": 4,
            "avgPrice": 4,
            "popularity": 95
        },
        {
            "id": 7,
            "name": "素食餐廳G",
            "city": "嘉義",
            "cuisine": "素食",
            "avgDiversity": 4,
            "avgService": 5,
            "avgPrice": 4,
            "popularity": 85
        },
        {
            "id": 8,
            "name": "海鮮餐廳H",
            "city": "基隆",
            "cuisine": "海鮮",
            "avgDiversity": 5,
            "avgService": 3,
            "avgPrice": 5,
            "popularity": 130
        }
    ],
    "comments": [
        {
            "restaurantId": 1,
            "userName": "Alice",
            "content": "餐點非常美味，服務也很好！",
            "diversityRating": 5,
            "serviceRating": 5,
            "priceRating": 4,
            "time": "2023-10-01 14:20"
        },
        {
            "restaurantId": 1,
            "userName": "Bob",
            "content": "環境優雅，推薦！",
            "diversityRating": 4,
            "serviceRating": 5,
            "priceRating": 3,
            "time": "2023-10-02 15:30"
        },
        {
            "restaurantId": 1,
            "userName": "Charlie",
            "content": "菜色多樣，價格合理。",
            "diversityRating": 5,
            "serviceRating": 4,
            "priceRating": 4,
            "time": "2023-10-03 16:40"
        },
        {
            "restaurantId": 1,
            "userName": "David",
            "content": "非常喜歡這裡的氣氛。",
            "diversityRating": 4,
            "serviceRating": 5,
            "priceRating": 4,
            "time": "2023-10-04 17:50"
        },

        {
            "restaurantId": 2,
            "userName": "Eve",
            "content": "日式料理很道地。",
            "diversityRating": 5,
            "serviceRating": 4,
            "priceRating": 4,
            "time": "2023-10-01 12:20"
        }

    ],
    "chatMessages": [
        {
            "userName": "Foodie1",
            "color": "#FF0000",
            "content": "大家好，有推薦的餐廳嗎？",
            "time": "14:00"
        },
        {
            "userName": "Gourmet2",
            "color": "#00FF00",
            "content": "我喜歡美味餐廳A！",
            "time": "14:05"
        }   
    
    ],
    "feedbacks": [
        {
            "userName": "Visitor1",
            "content": "網站設計很棒，使用起來很方便。",
            "time": "2023-10-05 10:00"
        },
        {
            "userName": "Visitor2",
            "content": "希望能增加更多餐廳資訊。",
            "time": "2023-10-06 11:15"
        },
        {
            "userName": "Visitor3",
            "content": "評論區域很實用，感謝！",
            "time": "2023-10-07 12:30"
        }
    ]
}
```



# 範例專案3: 互動式行事曆

## User Prompts

```markdown
完成以下需求並給我完整的程式碼:

# 互動式行事曆應用

## 概述
設計一個互動式行事曆應用，允許用戶查看、添加、編輯和刪除事件。該應用應具有直觀的界面和流暢的用戶體驗。

## 詳細需求

### 1. 主頁面佈局
- 頂部有一個深藍色的header，包含應用名稱"MyCalendar"和一個日曆圖標
- 主體分為左側邊欄和右側主內容區

### 2. 左側邊欄
- 顯示當前年份和月份
- 提供月份和年份的切換控件
- 顯示一個簡潔的月曆視圖，高亮顯示當前日期
- 可以點選日期並顯示包含該日當周的行事曆在右側區域
- 在月曆下方提供"新增事件"按鈕

### 3. 右側主內容區
- 默認顯示當前週的詳細視圖，且需要標明星期幾
- 每一天都顯示為一列，包含該天的所有事件
- 每個事件顯示為一個卡片，包含時間、標題和簡短描述
- 事件卡片的背景顏色根據事件類型而變（工作、個人、假期等）

### 4. 事件管理功能
- 點擊"新增事件"按鈕打開一個模態框
- 模態框包含表單：日期選擇器、時間選擇器、事件標題、描述、類型選擇
- 點擊已有事件可以編輯或刪除
- 編輯使用與新增相同的模態框，但預填充現有信息
- 刪除操作需要確認

### 5. 搜索和過濾
- 在header右側添加一個搜索框
- 允許按關鍵字搜索事件，只要有包含該關鍵字就可以
- 提供按事件類型過濾的下拉菜單
- 過濾下拉菜單旁有個確認按鈕，按下後即可顯示搜索結果
- 若搜索結果有多筆在不同周的話，會顯示每個結果的周排序下來，最近的在最上面，越遠的越下面
### 6. 響應式設計
- 在桌面端，左側邊欄和右側主內容區並排顯示
- 在移動端，左側邊欄可以滑入滑出，默認隱藏

### 7. 動畫效果
- 月份切換時，日曆有平滑的滑動效果
- 新增/編輯/刪除事件時，相應的事件卡片有淡入/淡出效果

### 8. 本地存儲
- 使用localStorage存儲用戶添加的事件
- 頁面加載時從localStorage讀取事件數據
- 每次修改後更新localStorage

### 9. 額外功能
- 實現一個簡單的"今日待辦"小部件，顯示在右側主內容區的頂部

### 10. 初始數據
- 創建一個包含至少10個不同類型事件的JSON文件作為初始數據
- 在首次加載時，如果localStorage為空，則使用這個JSON文件初始化日曆

## 技術要求
- 僅使用HTML、CSS和原生JavaScript
- 不使用任何外部庫或框架
- 確保代碼結構清晰，便於維護和擴展
- 注重性能優化，特別是在處理大量事件數據時

## 設計指南
- 使用柔和的配色方案，主色調為深藍色
- 確保足夠的對比度以提高可讀性
- 使用圓角和陰影來增加深度感
- 圖標使用簡潔的線條風格
```

## index.html

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>MyCalendar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><i class="calendar-icon">📅</i> MyCalendar</h1>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="搜索事件...">
            <select id="filter-select">
                <option value="all">所有類型</option>
                <option value="work">工作</option>
                <option value="personal">個人</option>
                <option value="holiday">假期</option>
            </select>
            <button id="search-button">搜索</button>
        </div>
    </header>
    <div class="container">
        <aside id="sidebar">
            <div class="calendar-controls">
                <button id="prev-month">←</button>
                <span id="current-month-year"></span>
                <button id="next-month">→</button>
            </div>
            <div id="mini-calendar"></div>
            <button id="add-event-button">新增事件</button>
        </aside>
        <main id="main-content">
            <div id="today-todo"></div>
            <div id="week-view"></div>
        </main>
    </div>
    <!-- 新增/編輯事件的模態框 -->
    <div id="event-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 id="modal-title">新增事件</h2>
            <form id="event-form">
                <label for="event-date">日期：</label>
                <input type="date" id="event-date" required>
                <label for="event-time">時間：</label>
                <input type="time" id="event-time" required>
                <label for="event-title">標題：</label>
                <input type="text" id="event-title" required>
                <label for="event-description">描述：</label>
                <textarea id="event-description"></textarea>
                <label for="event-type">類型：</label>
                <select id="event-type">
                    <option value="work">工作</option>
                    <option value="personal">個人</option>
                    <option value="holiday">假期</option>
                </select>
                <div class="modal-buttons">
                    <button type="submit" id="save-button">保存</button>
                    <button type="button" id="delete-button">刪除</button>
                </div>
            </form>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

## style.css

```css
/* 全局樣式 */
html, body {
    margin: 0;
    padding: 0;
    /* height: 100%; */
    width: 100%;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
}

header {
    background-color: #2c3e50;
    color: #fff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    margin: 0;
}

.calendar-icon {
    margin-right: 10px;
}

.search-container {
    display: flex;
    align-items: center;
}

.search-container input,
.search-container select {
    padding: 5px;
    margin-right: 10px;
}

.container {
    display: flex;
    flex-wrap: wrap;
    width: 100%; /* 添加這一行 */
    height: calc(100% - 70px); /* 假設 header 高度為 70px，根據實際情況調整 */
    overflow: hidden; /* 防止出現滾動條 */
}

/* 左側邊欄樣式 */
aside#sidebar {
    background-color: #ecf0f1;
    padding: 20px;
    width: 250px;
}

.calendar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#mini-calendar {
    margin-top: 20px;
}

#mini-calendar table {
    width: 100%;
    border-collapse: collapse;
}

#mini-calendar th,
#mini-calendar td {
    width: 14.28%;
    text-align: center;
    padding: 5px;
}

#mini-calendar th {
    background-color: #bdc3c7;
}

#mini-calendar td {
    cursor: pointer;
}

#mini-calendar td.today {
    background-color: #3498db;
    color: #fff;
    border-radius: 50%;
}

#mini-calendar td.selected {
    background-color: #2980b9;
    color: #fff;
    border-radius: 50%;
}

#add-event-button {
    margin-top: 20px;
    width: 100%;
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    border: none;
    cursor: pointer;
}

#add-event-button:hover {
    background-color: #2980b9;
}

/* 右側主內容區 */
main#main-content {
    flex: 1;
    padding: 20px;
}

#today-todo {
    margin-bottom: 20px;
}

#week-view {
    width: 100%;
}

/* 搜索結果中的週標題樣式 */
#week-view h2 {
    margin-top: 20px;
}


.day-column {
    flex: 1;
    min-width: 100%; /* 在手機端佔滿寬度 */
    margin: 5px 0; /* 調整間距 */
}

.day-column h3 {
    margin-top: 0;
}

.event-card {
    background-color: #e74c3c;
    color: #fff;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 3px;
    cursor: pointer;
}

.event-card.work {
    background-color: #3498db;
}

.event-card.personal {
    background-color: #2ecc71;
}

.event-card.holiday {
    background-color: #f1c40f;
}

.event-card:hover {
    opacity: 0.8;
}

/* 模態框樣式 */
.modal {
    display: none;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fff;
    margin: 10% auto;
    padding: 20px;
    width: 400px;
    border-radius: 5px;
    position: relative;
}

.close-button {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    right: 15px;
    top: 10px;
    cursor: pointer;
}

.close-button:hover {
    color: #000;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-buttons button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

#save-button {
    background-color: #3498db;
    color: #fff;
}

#delete-button {
    background-color: #e74c3c;
    color: #fff;
}

/* 響應式設計 */
@media (max-width: 768px) {
    aside#sidebar {
        display: none;
    }

    .container {
        flex-direction: column;
    }
}

/* 動畫效果 */
.fade-in {
    animation: fadeIn 0.5s;
}

.fade-out {
    animation: fadeOut 0.5s;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
}
/* 調整 week-container 的樣式 */
.week-container {
    margin-bottom: 20px;
}

/* 確保事件卡片單獨佔一行 */
.week-container .event-card {
    width: 100%;
    margin-bottom: 10px;
}
.modal-content form label,
.modal-content form input,
.modal-content form textarea,
.modal-content form select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
}

.modal-content form input,
.modal-content form textarea,
.modal-content form select {
    padding: 8px;
    box-sizing: border-box;
}
/* 響應式設計 */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        width: 100%;
        height: calc(100% - 70px); /* 根據 header 的高度調整 */
        overflow: hidden; /* 防止出現滾動條 */
    }

    aside#sidebar, main#main-content {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    }

    /* 確保內容不超過視窗寬度 */
    aside#sidebar {
        display: block;
        order: 1;
    }

    main#main-content {
        order: 2;
    }
}
/* 確保所有內容元素的寬度不超過父容器 */
aside#sidebar, main#main-content, .day-column, .event-card {
    max-width: 100%;
    box-sizing: border-box;
}
```

## script.js

```javascript

// 全局變量
let events = [];
let currentDate = new Date();
let selectedDate = new Date();
let editingEventId = null;

// 初始化函數
window.onload = function() {
    loadEvents();
    initCalendar();
    initWeekView();
    initEventModal();
    initSearchAndFilter();
    initTodayTodo();
};

// 從localStorage或JSON文件加載事件
function loadEvents() {
    if (localStorage.getItem('events')) {
        events = JSON.parse(localStorage.getItem('events'));
    } else {
        fetch('events.json')
            .then(response => response.json())
            .then(data => {
                events = data;
                saveEvents();
            });
    }
}

// 保存事件到localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// 初始化小日曆
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').onclick = () => changeMonth(-1);
    document.getElementById('next-month').onclick = () => changeMonth(1);
}

// 更新小日曆
function updateCalendar() {
    const monthYearLabel = document.getElementById('current-month-year');
    monthYearLabel.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const calendarBody = document.createElement('table');
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];

    // 表頭
    const headerRow = document.createElement('tr');
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    calendarBody.appendChild(headerRow);

    // 日期
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay.getDay()) {
                cell.textContent = '';
            } else if (date > lastDay.getDate()) {
                break;
            } else {
                cell.textContent = date;
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
                if (isSameDay(cellDate, new Date())) {
                    cell.classList.add('today');
                }
                if (isSameDay(cellDate, selectedDate)) {
                    cell.classList.add('selected');
                }
                cell.onclick = () => {
                    selectedDate = cellDate;
                    updateCalendar();
                    initWeekView();
                };
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
    const miniCalendar = document.getElementById('mini-calendar');
    miniCalendar.innerHTML = '';
    miniCalendar.appendChild(calendarBody);
}

// 切換月份
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

// 判斷是否為同一天
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 初始化週視圖
function initWeekView() {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = '';
    weekView.style.display = 'flex'; // 添加這一行
    weekView.style.flexWrap = 'wrap'; // 添加這一行
    const startOfWeek = getStartOfWeek(selectedDate);
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(dayDate.getDate() + i);
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('day-column');
        dayColumn.innerHTML = `<h3>${getDayName(dayDate.getDay())} (${dayDate.getMonth() + 1}/${dayDate.getDate()})</h3>`;
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), dayDate));
        dayEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card', event.type);
            eventCard.innerHTML = `<strong>${event.time}</strong> ${event.title}`;
            eventCard.onclick = () => openEventModal(event);
            dayColumn.appendChild(eventCard);
        });
        weekView.appendChild(dayColumn);
    }
}

// 獲取星期名稱
function getDayName(dayIndex) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[dayIndex];
}

// 獲取當週的開始日期
function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

// 初始化事件模態框
function initEventModal() {
    const modal = document.getElementById('event-modal');
    const closeButton = document.querySelector('.close-button');
    const addEventButton = document.getElementById('add-event-button');
    const saveButton = document.getElementById('save-button');
    const deleteButton = document.getElementById('delete-button');
    const eventForm = document.getElementById('event-form');

    addEventButton.onclick = () => openEventModal();
    closeButton.onclick = () => closeEventModal();
    window.onclick = event => {
        if (event.target == modal) {
            closeEventModal();
        }
    };

    saveButton.onclick = event => {
        event.preventDefault();
        saveEvent();
    };

    deleteButton.onclick = event => {
        event.preventDefault();
        deleteEvent();
    };
}

// 打開事件模態框
function openEventModal(event = null) {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'block';
    if (event) {
        document.getElementById('modal-title').textContent = '編輯事件';
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-type').value = event.type;
        document.getElementById('delete-button').style.display = 'inline-block';
        editingEventId = event.id;
    } else {
        document.getElementById('modal-title').textContent = '新增事件';
        document.getElementById('event-form').reset();
        document.getElementById('delete-button').style.display = 'none';
        editingEventId = null;
    }
}

// 關閉事件模態框
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'none';
}

// 保存事件
function saveEvent() {
    const event = {
        id: editingEventId || Date.now(),
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        type: document.getElementById('event-type').value
    };
    if (editingEventId) {
        const index = events.findIndex(e => e.id === editingEventId);
        events[index] = event;
    } else {
        events.push(event);
    }
    saveEvents();
    initWeekView();
    initTodayTodo();
    closeEventModal();
}

// 刪除事件
function deleteEvent() {
    if (confirm('確定要刪除這個事件嗎？')) {
        events = events.filter(e => e.id !== editingEventId);
        saveEvents();
        initWeekView();
        initTodayTodo();
        closeEventModal();
    }
}

// 初始化搜索和過濾功能
function initSearchAndFilter() {
    const searchButton = document.getElementById('search-button');
    searchButton.onclick = () => {
        const keyword = document.getElementById('search-input').value.toLowerCase();
        const filterType = document.getElementById('filter-select').value;
        const filteredEvents = events.filter(event => {
            const matchesKeyword = event.title.toLowerCase().includes(keyword) ||
                                   event.description.toLowerCase().includes(keyword);
            const matchesType = filterType === 'all' || event.type === filterType;
            return matchesKeyword && matchesType;
        });
        displaySearchResults(filteredEvents);
    };
}

// 顯示搜索結果
function displaySearchResults(results) {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = '';
    weekView.style.display = 'block'; // 添加這一行
    const groupedEvents = groupEventsByWeek(results);
    const sortedWeeks = Object.keys(groupedEvents).sort((a, b) => b - a); // 近期的在上面
    sortedWeeks.forEach(weekStart => {
        const weekContainer = document.createElement('div');
        weekContainer.classList.add('week-container');
        const date = new Date(Number(weekStart));
        const weekHeader = document.createElement('h2');
        weekHeader.textContent = `週開始於 ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        weekContainer.appendChild(weekHeader);
        const weekEvents = groupedEvents[weekStart];
        weekEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card', event.type);
            eventCard.innerHTML = `<strong>${event.date} ${event.time}</strong> ${event.title}`;
            eventCard.onclick = () => openEventModal(event);
            weekContainer.appendChild(eventCard);
        });
        weekView.appendChild(weekContainer);
    });
}


// 按週分組事件
function groupEventsByWeek(events) {
    const groups = {};
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const startOfWeek = getStartOfWeek(eventDate).getTime();
        if (!groups[startOfWeek]) {
            groups[startOfWeek] = [];
        }
        groups[startOfWeek].push(event);
    });
    return groups;
}

// 初始化今日待辦
function initTodayTodo() {
    const todayTodo = document.getElementById('today-todo');
    const todayEvents = events.filter(event => isSameDay(new Date(event.date), new Date()));
    if (todayEvents.length > 0) {
        todayTodo.innerHTML = '<h2>今日待辦事項</h2>';
        todayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-card', event.type);
            eventItem.innerHTML = `<strong>${event.time}</strong> ${event.title}`;
            eventItem.onclick = () => openEventModal(event);
            todayTodo.appendChild(eventItem);
        });
    } else {
        todayTodo.innerHTML = '';
    }
}
```

## events.json

```json

[
    {
        "id": 1,
        "date": "2023-10-05",
        "time": "09:00",
        "title": "團隊會議",
        "description": "討論項目進度",
        "type": "work"
    },
    {
        "id": 2,
        "date": "2024-10-01",
        "time": "09:00",
        "title": "公司年度大會",
        "description": "公司年度大會",
        "type": "work"
    },
    {
        "id": 3,
        "date": "2024-10-01",
        "time": "12:00",
        "title": "午餐",
        "description": "午餐",
        "type": "personal"
    },
    {
        "id": 4,
        "date": "2024-10-01",
        "time": "14:00",
        "title": "公司年度大會",
        "description": "公司年度大會",
        "type": "work"
    },
    {
        "id": 5,
        "date": "2024-10-01",
        "time": "18:00",
        "title": "晚餐",
        "description": "晚餐",
        "type": "personal"
    },
    {
        "id": 6,
        "date": "2024-10-01",
        "time": "20:00",
        "title": "公司年度大會",
        "description": "公司年度大會",
        "type": "work"
    },
    {
        "id": 7,
        "date": "2024-10-02",
        "time": "09:00",
        "title": "公司年度大會",
        "description": "公司年度大會",
        "type": "work"
    },
    {
        "id": 8,
        "date": "2024-10-02",
        "time": "12:00",
        "title": "午餐",
        "description": "午餐",
        "type": "personal"
    },
    {
        "id": 9,
        "date": "2024-10-02",
        "time": "14:00",
        "title": "公司年度大會",
        "description": "公司年度大會",
        "type": "work"
    }
]
```


以上是三個範例，以下是一份新的使用者需求，幫我依照使用者需求生成符合所有需求的完整程式碼和資料: