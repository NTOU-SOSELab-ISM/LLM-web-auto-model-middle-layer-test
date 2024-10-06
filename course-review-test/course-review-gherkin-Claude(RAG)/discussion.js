let messages = [];

// 從 localStorage 加載消息
function loadMessages() {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
        displayMessages();
    } else {
        // 如果沒有存儲的消息，加載初始消息
        fetch('initial_messages.json')
            .then(response => response.json())
            .then(data => {
                messages = data;
                displayMessages();
                saveMessages();
            });
    }
}

// 顯示消息
function displayMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span style="color: ${message.color}">${message.nickname}</span>
            <span>${message.time}</span>: ${message.content}
        `;
        chatMessages.appendChild(messageElement);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 保存消息到 localStorage
function saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// 發送消息
function sendMessage() {
    const nickname = document.getElementById('nickname').value;
    const content = document.getElementById('message-input').value;
    const color = document.getElementById('message-color').value;

    if (nickname && content) {
        const newMessage = {
            nickname,
            content,
            color,
            time: new Date().toLocaleTimeString()
        };

        messages.push(newMessage);
        displayMessages();
        saveMessages();

        document.getElementById('message-input').value = '';
    } else {
        alert('請輸入暱稱和訊息內容！');
    }
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});