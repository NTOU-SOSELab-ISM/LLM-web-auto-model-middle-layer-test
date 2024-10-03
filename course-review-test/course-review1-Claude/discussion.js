let messages = [];

// 載入討論訊息
fetch('messages.json')
    .then(response => response.json())
    .then(data => {
        messages = data;
        renderMessages();
    });

function renderMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span class="timestamp">${message.timestamp}</span>
            <span class="nickname" style="color: ${message.color}">${message.nickname}</span>
            <span class="content">${message.content}</span>
        `;
        chatMessages.appendChild(messageElement);
    });
    
    // 滾動到最新訊息
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const colorPicker = document.getElementById('colorPicker');
const nicknameInput = document.getElementById('nicknameInput');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const color = colorPicker.value;
    const nickname = nicknameInput.value || '匿名';
    const content = messageInput.value.trim();
    
    if (content) {
        const newMessage = {
            timestamp: new Date().toLocaleString(),
            color,
            nickname,
            content
        };
        
        messages.push(newMessage);
        renderMessages();
        messageInput.value = '';
        
        // 將新訊息保存到 JSON 文件（實際應用中應由後端處理）
        // 這裡僅作為示範，實際上前端無法直接寫入文件
        console.log('New message:', newMessage);
    }
}

// 初始化：顯示所有訊息
renderMessages();