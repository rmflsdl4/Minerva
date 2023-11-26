const connectIp = "3.39.9.46";
const socket = new WebSocket(`ws://${connectIp}:3000`);

// 서버로부터 메시지 수신 시
socket.addEventListener('message', (event) => {
    ControllerOutputBook(event.data);
});

// 클라이언트에게 메시지 전송
async function sendMessage(isbn) {
    const state = await GetRobotState();
    if(state){
        const data = { message: '[클라이언트 요청] 가져오기 버튼을 클릭했음 !', ISBN: isbn };
        const jsonString = JSON.stringify(data);

        console.log("sendMessage 실행");
        // 서버에 메시지 전송
        socket.send(jsonString);
        SetRobotState(false);
        SetRobotStateText();
        alert("로봇이 도서를 운반중입니다. 잠시만 기다려주세요.");
    }
    else{
        alert("현재 사용 가능한 로봇이 없습니다. 잠시만 기다려주세요.");
    }
}
async function GetRobotState(){
    return await new Promise((resolve, reject) => {
        fetch(`/get-robot-state`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}
function SetRobotState(stateValue){
    fetch(`/set-robot-state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: stateValue }),
    })
}
async function SetRobotStateText(){
    const state = await GetRobotState();
    console.log(typeof state);
    const stateText = document.getElementById('robotStateText');

    if(state){
        stateText.textContent = '사용 가능';
    }
    else{
        stateText.textContent = '도서 운반 중';
    }
}