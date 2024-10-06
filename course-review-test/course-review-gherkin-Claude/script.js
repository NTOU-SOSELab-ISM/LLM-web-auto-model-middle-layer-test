// 初始数据
const initialData = {
    "courses": [
      {
        "id": 1,
        "name": "程式設計導論",
        "teacher": "王大明",
        "coolness": 4,
        "grading": 3,
        "difficulty": 2,
        "discussionHeat": 2
      },
      {
        "id": 2,
        "name": "資料結構",
        "teacher": "李小華",
        "coolness": 3,
        "grading": 4,
        "difficulty": 4,
        "discussionHeat": 2
      },
      {
        "id": 3,
        "name": "演算法",
        "teacher": "張三",
        "coolness": 2,
        "grading": 3,
        "difficulty": 5,
        "discussionHeat": 1
      },
      {
        "id": 4,
        "name": "資料庫系統",
        "teacher": "陳四",
        "coolness": 4,
        "grading": 4,
        "difficulty": 3,
        "discussionHeat": 0
      },
      {
        "id": 5,
        "name": "網頁程式設計",
        "teacher": "林五",
        "coolness": 5,
        "grading": 4,
        "difficulty": 2,
        "discussionHeat": 0
      },
      {
        "id": 6,
        "name": "人工智慧導論",
        "teacher": "黃六",
        "coolness": 5,
        "grading": 3,
        "difficulty": 4,
        "discussionHeat": 0
      }
    ],
    "reviews": [
      {
        "id": 1,
        "courseId": 1,
        "userName": "學生A",
        "comment": "這門課很有趣，老師講解清楚",
        "coolness": 4,
        "grading": 3,
        "difficulty": 2
      },
      {
        "id": 2,
        "courseId": 1,
        "userName": "學生B",
        "comment": "作業有點多，但是學到很多",
        "coolness": 3,
        "grading": 4,
        "difficulty": 3
      },
      {
        "id": 3,
        "courseId": 2,
        "userName": "學生C",
        "comment": "內容難度較高，需要花時間理解",
        "coolness": 2,
        "grading": 3,
        "difficulty": 5
      },
      {
        "id": 4,
        "courseId": 2,
        "userName": "學生D",
        "comment": "老師講解詳細，很有幫助",
        "coolness": 4,
        "grading": 4,
        "difficulty": 4
      },
      {
        "id": 5,
        "courseId": 3,
        "userName": "學生E",
        "comment": "課程內容豐富，但作業有挑戰性",
        "coolness": 3,
        "grading": 3,
        "difficulty": 5
      }
    ],
    "messages": [
      {
        "time": "14:30:00",
        "nickname": "討論者A",
        "content": "大家好！有人修過程式設計導論嗎？",
        "color": "#FF0000"
      },
      {
        "time": "14:31:05",
        "nickname": "討論者B",
        "content": "我修過，那門課蠻有趣的",
        "color": "#00FF00"
      },
      {
        "time": "14:32:30",
        "nickname": "討論者C",
        "content": "對啊，老師講得很清楚",
        "color": "#0000FF"
      }
    ]
  };
  
  let courses = initialData.courses;
  let reviews = initialData.reviews;
  let messages = initialData.messages;
  
  // 初始化
  function init() {
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
          displayCourses();
          setupEventListeners();
      } else if (window.location.pathname.includes('discussion.html')) {
          displayMessages();
          setupEventListeners();
      }
  }
  
  // 顯示課程列表
  function displayCourses() {
      const courseList = document.getElementById('course-list');
      courseList.innerHTML = '';
      courses.forEach(course => {
          const card = document.createElement('div');
          card.classList.add('course-card');
          card.innerHTML = `
              <h3>${course.name}</h3>
              <p>老師：${course.teacher}</p>
              <div class="rating">
                  涼度評分：${generateStars(course.coolness)}
              </div>
              <div class="rating">
                  給分甜度評分：${generateStars(course.grading)}
              </div>
              <div class="rating">
                  考試難度評分：${generateStars(course.difficulty)}
              </div>
              <p>討論熱度：${course.discussionHeat} 則評論</p>
          `;
          card.addEventListener('click', () => displayCourseDetails(course.id));
          courseList.appendChild(card);
      });
  }
  
  // 生成星星評分
  function generateStars(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
          stars += `<span class="star ${i <= rating ? 'filled' : 'empty'}">★</span>`;
      }
      return stars;
  }
  
  // 顯示課程詳情和評論
  function displayCourseDetails(courseId) {
      const courseDetails = document.getElementById('course-details');
      const course = courses.find(c => c.id === courseId);
      const courseReviews = reviews.filter(r => r.courseId === courseId);
      
      document.querySelectorAll('.course-card').forEach(card => card.classList.remove('selected'));
      document.querySelector(`.course-card:nth-child(${courseId})`).classList.add('selected');
      
      courseDetails.innerHTML = `
          <h2>${course.name}</h2>
          <p>老師：${course.teacher}</p>
          <button id="add-review-button">新增課程評論</button>
          <div id="review-form" style="display: none;">
              <input type="text" id="user-name" placeholder="輸入使用者名稱">
              <textarea id="review-text" placeholder="輸入評論"></textarea>
              <div class="rating">
                  <label>涼度評分：</label>
                  <div class="stars" data-rating="coolness">${generateStars(0)}</div>
              </div>
              <div class="rating">
                  <label>給分甜度評分：</label>
                  <div class="stars" data-rating="grading">${generateStars(0)}</div>
              </div>
              <div class="rating">
                  <label>考試難度評分：</label>
                  <div class="stars" data-rating="difficulty">${generateStars(0)}</div>
              </div>
              <button id="submit-review">提交評論</button>
          </div>
          <div id="reviews-list"></div>
      `;
      
      const reviewsList = document.getElementById('reviews-list');
      courseReviews.forEach(review => {
          const reviewCard = document.createElement('div');
          reviewCard.classList.add('review-card');
          reviewCard.innerHTML = `
              <h4>${review.userName}</h4>
              <p>${review.comment}</p>
              <div class="rating">
                  涼度評分：${generateStars(review.coolness)}
              </div>
              <div class="rating">
                  給分甜度評分：${generateStars(review.grading)}
              </div>
              <div class="rating">
                  考試難度評分：${generateStars(review.difficulty)}
              </div>
          `;
          reviewsList.appendChild(reviewCard);
      });
      
      document.getElementById('add-review-button').addEventListener('click', toggleReviewForm);
      document.getElementById('submit-review').addEventListener('click', () => submitReview(courseId));
      setupStarRating();
  }
  
  // 切換評論表單顯示
  function toggleReviewForm() {
      const form = document.getElementById('review-form');
      const button = document.getElementById('add-review-button');
      if (form.style.display === 'none') {
          form.style.display = 'block';
          button.textContent = '顯示課程';
      } else {
          form.style.display = 'none';
          button.textContent = '新增課程評論';
      }
  }
  
  // 設置星級評分
  function setupStarRating() {
      document.querySelectorAll('.stars[data-rating]').forEach(container => {
          const stars = container.querySelectorAll('.star');
          stars.forEach((star, index) => {
              star.addEventListener('click', () => {
                  const rating = index + 1;
                  container.dataset.value = rating;
                  updateStars(container, rating);
              });
          });
      });
  }
  
  // 更新星星顯示
  function updateStars(container, rating) {
      const stars = container.querySelectorAll('.star');
      stars.forEach((star, index) => {
          star.classList.toggle('filled', index < rating);
          star.classList.toggle('empty', index >= rating);
      });
  }
  
  // 提交評論
  function submitReview(courseId) {
      const userName = document.getElementById('user-name').value;
      const comment = document.getElementById('review-text').value;
      const coolness = document.querySelector('.stars[data-rating="coolness"]').dataset.value;
      const grading = document.querySelector('.stars[data-rating="grading"]').dataset.value;
      const difficulty = document.querySelector('.stars[data-rating="difficulty"]').dataset.value;
      
      if (!userName || !comment || !coolness || !grading || !difficulty) {
          alert('請填寫所有欄位');
          return;
      }
      
      const newReview = {
          id: reviews.length + 1,
          courseId: courseId,
          userName: userName,
          comment: comment,
          coolness: parseInt(coolness),
          grading: parseInt(grading),
          difficulty: parseInt(difficulty)
      };
      
      reviews.unshift(newReview);
      updateCourseRatings(courseId);
      displayCourseDetails(courseId);
      toggleReviewForm();
  }
  
  // 更新課程評分
  function updateCourseRatings(courseId) {
      const courseReviews = reviews.filter(r => r.courseId === courseId);
      const course = courses.find(c => c.id === courseId);
      
      course.coolness = Math.round(average(courseReviews.map(r => r.coolness)));
      course.grading = Math.round(average(courseReviews.map(r => r.grading)));
      course.difficulty = Math.round(average(courseReviews.map(r => r.difficulty)));
      course.discussionHeat = courseReviews.length;
      
      displayCourses();
  }
  
  // 平均值計算輔助函數
  function average(arr) {
      return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  // 搜索功能
  function searchCourses() {
      const searchInput = document.getElementById('search-input').value.toLowerCase();
      const searchType = document.getElementById('search-type').value;
      
      const filteredCourses = courses.filter(course => {
          if (searchType === 'course') {
              return course.name.toLowerCase().includes(searchInput);
          } else {
              return course.teacher.toLowerCase().includes(searchInput);
          }
      });
      
      const courseList = document.getElementById('course-list');
      courseList.innerHTML = '';
      
      if (filteredCourses.length === 0) {
          courseList.innerHTML = '<p>沒有找到符合條件的課程</p>';
      } else {
          filteredCourses.forEach(course => {
              const card = document.createElement('div');
              card.classList.add('course-card');
              card.innerHTML = `
                  <h3>${course.name}</h3>
                  <p>老師：${course.teacher}</p>
                  <div class="rating">
                      涼度評分：${generateStars(course.coolness)}
                  </div>
                  <div class="rating">
                      給分甜度評分：${generateStars(course.grading)}
                  </div>
                  <div class="rating">
                      考試難度評分：${generateStars(course.difficulty)}
                  </div>
                  <p>討論熱度：${course.discussionHeat} 則評論</p>
              `;
              card.addEventListener('click', () => displayCourseDetails(course.id));
              courseList.appendChild(card);
          });
      }
  }
  
  // 討論區功能
  function displayMessages() {
      const messageList = document.getElementById('message-list');
      messageList.innerHTML = '';
      messages.forEach(message => {
          const messageElement = document.createElement('div');
          messageElement.classList.add('message');
          messageElement.innerHTML = `
              <span class="time">${message.time}</span>
              <span class="nickname" style="color: ${message.color}">${message.nickname}</span>: ${message.content}
          `;
          messageList.appendChild(messageElement);
      });
      messageList.scrollTop = messageList.scrollHeight;
  }
  
  function sendMessage() {
      const nickname = document.getElementById('nickname').value;
      const content = document.getElementById('message').value;
      const color = document.getElementById('color-picker').value;
      
      if (!nickname || !content) {
          alert('請輸入暱稱和訊息');
          return;
      }
      
      const newMessage = {
          time: new Date().toLocaleTimeString(),
          nickname: nickname,
          content: content,
          color: color
      };
      
      messages.push(newMessage);
      displayMessages();
      document.getElementById('message').value = '';
  }
  
  // 事件監聽器設置
  function setupEventListeners() {
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
          document.getElementById('search-button').addEventListener('click', searchCourses);
          document.getElementById('search-input').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                  searchCourses();
              }
          });
      } else if (window.location.pathname.includes('discussion.html')) {
          document.getElementById('send-message').addEventListener('click', sendMessage);
            document.getElementById('message').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    // 初始化函數調用
    window.addEventListener('DOMContentLoaded', init);