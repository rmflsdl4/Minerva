const socket = new WebSocket('ws://43.201.10.205:3000');

// 서버로부터 메시지 수신 시
socket.addEventListener('message', (event) => {
    console.log('Received message from server:', event.data);
});

// 클라이언트에게 메시지 전송
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    // 서버에 메시지 전송
    socket.send(message);

    // 입력 필드 비우기
    messageInput.value = '';
}