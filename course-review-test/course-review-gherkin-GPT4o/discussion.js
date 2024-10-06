document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('message-list');
    const sendBtn = document.getElementById('send-btn');

    const messages = [
        { username: 'Alice', color: '#FF0000', content: '大家好!', time: '10:00 AM' },
        { username: 'Bob', color: '#0000FF', content: '這個課程真不錯!', time: '10:05 AM' }
    ];

    function renderMessages() {
        messageList.innerHTML = '';
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `<span style="color: ${msg.color};">${msg.username}</span> (${msg.time}): ${msg.content}`;
            messageList.appendChild(messageDiv);
        });
    }

    sendBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const color = document.getElementById('color-picker').value;
        const message = document.getElementById('message').value;
        const time = new Date().toLocaleTimeString();

        if (username && message) {
            messages.push({ username, color, content: message, time });
            renderMessages();
        }
    });

    renderMessages(); // 初始載入歷史訊息
});
