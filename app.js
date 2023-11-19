// 사용 모듈 로드
const express = require('express');
const fs = require('fs');
const database = require('./DataBase.js');
// 서버 설정
const app = express();

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 서버 구동
const server = app.listen(3000, function(){
    console.log('[서버 로그] 서버 연결 성공! [ 아래는 구동된 서버 주소 ]');
    console.log("주소: " + server.address().address + ":3000");
    database.Connect();
});
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
    console.log(bookData);
    res.send(bookData);
});
