let chatData = {
    "messages": [
        { "color": "red", "nickname": "Alice", "content": "大家好！", "time": "10:00" },
        { "color": "green", "nickname": "Bob", "content": "歡迎加入討論！", "time": "10:01" },
        { "color": "blue", "nickname": "Charlie", "content": "今天的課很有趣！", "time": "10:02" }
    ]
};

// 初始化討論區
window.onload = function () {
    loadChatHistory();
};

// 顯示歷史訊息
function loadChatHistory() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '';
    chatData.messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.style.color = message.color;
        messageItem.innerHTML = `
            <strong>${message.nickname}</strong> (${message.time}): ${message.content}
        `;
        chatHistory.appendChild(messageItem);
    });
}

// 發送新訊息
function sendMessage() {
    const color = document.getElementById('messageColor').value;
    const nickname = document.getElementById('nickname').value;
    const content = document.getElementById('messageInput').value;
    const time = new Date().toLocaleTimeString().slice(0, 5);

    const newMessage = { "color": color, "nickname": nickname, "content": content, "time": time };
    chatData.messages.push(newMessage);
    loadChatHistory();
}
