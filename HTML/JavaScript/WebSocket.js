const socket = new WebSocket('ws://3.34.177.157:3000');

// 서버로부터 메시지 수신 시
socket.addEventListener('message', (event) => {
    ControllerOutputBook(event.data);
});

// 클라이언트에게 메시지 전송
function sendMessage(isbn) {
    const data = { message: '[클라이언트 요청] 가져오기 버튼을 클릭했음 !', ISBN: isbn };
    const jsonString = JSON.stringify(data);
    console.log("sendMessage 실행");
    // 서버에 메시지 전송
    socket.send(jsonString);
}