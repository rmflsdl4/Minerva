// 사용 모듈 로드
const express = require('express');
const fs = require('fs');
const database = require('./DataBase.js');
const webSocket = require('ws');
const http = require('http');


// 사용자 지정 모듈 로드

// 서버 설정
const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({ server });

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// 라우팅 설정
app.get('/', function(req, res){
    fs.readFile('HTML/Main.html', function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});

// 연결된 모든 클라이언트를 저장하는 배열
const clients = [];

// ISBN 전역변수
let isbnData = null;

// WebSocket 연결 시
wss.on('connection', (ws, request) => {
    // 클라이언트를 배열에 추가
    clients.push(ws);
    

    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    
    console.log(`새로운 클라이언트[${ip}] 접속`);
    // 클라이언트로부터 메시지 수신 시
    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        console.log(data.message.toString('utf8') + `   |   요청한 클라이언트 : ${ip}`);
        console.log(`[서버 로그] ISBN - ${data.ISBN}`);
        isbnData = data.ISBN;
        console.log(`[서버 로그] 현재 저장된 전역 ISBN: ${isbnData}`)


        // 모든 클라이언트에게 메시지 전송
        clients.forEach((client) => {
            // client !== ws는 메세지를 보낸 클라이언트가 아니라면
            if (client !== ws && client.readyState === webSocket.OPEN) {
                console.log("[서버 로그] 클라이언트에게 메세지 보냄");
                client.send(data.ISBN);
            }
        });
    });
  
    // 클라이언트 연결 종료 시
    ws.on('close', () => {
        // 배열에서 클라이언트 제거
        clients.splice(clients.indexOf(ws), 1);
        console.log(clients.length);
    });
});

// 서버 구동
server.listen(3000, function(){
    console.log('[서버 로그] 서버 연결 성공!');
    database.Connect();
});

// 서버 오류 처리
process.on('uncaughtException', (err) => {
    console.error('오류가 발생했습니다:', err);
  
    database.Close();
    
    process.exit(1); // 0이 아닌 값은 비정상적인 종료를 나타냄
});




// 가상 경로 설정
app.post('/book-load', async (req, res) => {
    const sql = "SELECT ISBN, PUB, TITLE, PUB_YEAR, IMG_NAME, AUTHOR FROM book";

    const bookData = await database.Query(sql);
    res.send(bookData);
});

app.get('/detailBook-load', async (req, res) => {
    const isbn = req.query.isbn;
    const sql = `SELECT ISBN, TITLE, AUTHOR, PUB, PUB_YEAR, 
                CASE
                    WHEN STATUS = 'T' THEN '대출 가능'
                    WHEN STATUS = 'F' THEN '대출 불가능'
                END AS STATUS, 
                IMG_NAME
                FROM book
                WHERE isbn = ?`;
    try{
        const bookData = await database.Query(sql, isbn);
        res.send(bookData);
    }
    catch(err){
        console.log("[서버 로그] 오류 발생: " + err);
    }
});

app.get('/controller-book-load', async (req, res) => {
    const isbn = req.query.isbn;
    console.log(isbn);
    const sql = `SELECT TITLE, AUTHOR, PUB, PUB_YEAR, CONCAT(SHELF_LOCATION,' 책장') as SHELF_LOCATION
                FROM book
                INNER JOIN book_location
                ON book.ISBN = book_location.ISBN
                WHERE book.ISBN = ?`
    
    try{
        const bookData = await database.Query(sql, isbn);
        res.send(bookData);
    }
    catch(err){
        console.log("[서버 로그] 오류 발생: " + err);
    }
    
});

async function RecusionRequest(cnt){
    if(isbnData !== null){
        console.log(['[서버 로그] isbn 값이 존재하여 해당 책 데이터 반환!']);
        const tempData = isbnData;

        const sql = `SELECT TITLE, AUTHOR, PUB, PUB_YEAR, CONCAT(SHELF_LOCATION,' 책장') as SHELF_LOCATION
        FROM book
        INNER JOIN book_location
        ON book.ISBN = book_location.ISBN
        WHERE book.ISBN = ?`
        try{
            const bookData = await database.Query(sql, tempData);
        
            isbnData = null;
            return bookData[0];
        }
        catch(err){
            console.log("[서버 로그] 오류 발생: " + err);
        }
    }
    // cnt < 반복할 횟수
    if(cnt < 20){
        console.log("[서버 로그] isbn 값이 없어서 재귀함수 실행!  isbn 상태: " + isbnData)
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await RecusionRequest(cnt + 1);
    }
    else{
        console.log("[서버 로그] 12초 동안 isbn 값을 기다렸지만 값이 오지 않아 함수 호출 종료!");
    }
}
app.post('/book-search', async (req, res) => {
    const searchValue = req.body.search;
    console.log("[서버 로그] 사용자가 입력한 도서 검색어 : " + searchValue);

    const sql = `SELECT ISBN, TITLE, AUTHOR, PUB, PUB_YEAR, STATUS, IMG_NAME
                FROM book WHERE TITLE LIKE ? OR AUTHOR LIKE ? OR PUB LIKE ? OR PUB_YEAR LIKE ?`;
    const values = [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`];
    try{
        const bookData = await database.Query(sql, values);
    
        res.send(bookData);
    }
    catch(err){
        console.log("[서버 로그] 오류 발생: " + err);
    }
});

let piConfig = [];
app.get('/request-data', async (req, res) => {
    piConfig = [req, res];
    console.log(piConfig[0], piConfig[1]);
    console.log("[서버 로그] 라즈베리파이 파이썬 스크립트로부터 요청 들어옴!");
    const data = await RecusionRequest(0);
    console.log("[서버 로그] data 값: " + data);
    res.json(data);
});
