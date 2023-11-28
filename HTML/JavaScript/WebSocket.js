const connectIp = "3.39.9.46";
const socket = new WebSocket(`ws://${connectIp}:3000`);



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

function SetBarcode(){
    const barcodeValue = document.getElementById('barcode').value;
    
    fetch(`/set-barcode?scanValue=${barcodeValue}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    });
    document.getElementById('barcode').value = '';
}
async function GetSavedBookLoad(){
    return await new Promise((resolve, reject) => {
        fetch(`/get-saved-book`, {
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
async function GetSavedBook(){
    const bookElement = document.getElementById('bookDiv');
    let book = "";

    const bookData = await GetSavedBookLoad();
    console.log(bookData);
    book += `<h2 id='bookTitle'>📖 ${bookData[0].TITLE}</h2>
            <p><span id='bookAuthor'>🔖 저자 ｜ ${bookData[0].AUTHOR}</span></p>
            <p><span id='bookPub'>🔖 출판사 ｜ ${bookData[0].PUB}</span></p>
            <p><span id='bookPubYear'>🔖 출판년도 ｜ ${bookData[0].PUB_YEAR}</span></p>
            <p><span id='bookLocation'>🌍 책 위치 ｜ ${bookData[0].SHELF_LOCATION}</span></p>`;

    bookElement.innerHTML = book;
}
