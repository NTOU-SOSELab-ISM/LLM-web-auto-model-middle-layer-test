let messages = [];

function fetchMessages() {
    // 這裡應該是一個 API 調用，但我們將使用模擬數據
    messages = [
        { id: 1, nickname: "學生A", color: "#FF0000", content: "大家好！", timestamp: new Date("2023-05-01T10:00:00") },
        { id: 2, nickname: "學生B", color: "#00FF00", content: "有人修過線性代數嗎？", timestamp: new Date("2023-05-01T10:05:00") },
        { id: 3, nickname: "學生C", color: "#0000FF", content: "我修過，很有趣的課程！", timestamp: new Date("2023-05-01T10:10:00") },
        { id: 4, nickname: "學生D", color: "#FF00FF", content: "考試難度如何？", timestamp: new Date("2023-05-01T10:15:00") },
        { id: 5, nickname: "學生E", color: "#00FFFF", content: "難度適中，好好準備就沒問題。", timestamp: new Date("2023-05-01T10:20:00") },
    ];
    displayMessages();
}

function displayMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span style="color: ${message.color}">${message.nickname}</span>
            <span>${message.content}</span>
            <span class="timestamp">${formatTimestamp(message.timestamp)}</span>
        `;
        chatMessages.appendChild(messageElement);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTimestamp(timestamp) {
    return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(timestamp);
}

function sendMessage() {
    const nickname = document.getElementById('nickname').value;
    const content = document.getElementById('messageInput').value;
    const color = document.getElementById('messageColor').value;

    if (!nickname || !content) {
        alert('請填寫暱稱和訊息');
        return;
    }

    const newMessage = {
        id: Date.now(),
        nickname: nickname,
        color: color,
        content: content,
        timestamp: new Date()
    };

    messages.push(newMessage);
    displayMessages();

    // 清空輸入框
    document.getElementById('messageInput').value = '';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});