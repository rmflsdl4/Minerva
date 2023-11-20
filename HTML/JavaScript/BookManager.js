// 책 정보 가져오기
async function BookLoad(){
    return await new Promise((resolve, reject) => {
        fetch('/book-load', {
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
async function DetailBookLoad(isbn){
    return await new Promise((resolve, reject) => {
        fetch(`/detailBook-load?isbn=${isbn}`, {
            method: 'GET',
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

// 북 세팅
async function BookInit(pageSortFunc){
    const bookElement = document.getElementById('BookRow');
    let book = "";

    const bookData = await BookLoad();

    let bookCnt = 0;
    for (let i = 0; i < bookData.length; i++) {
        book += `<th class='BookData'>
                    <form action='/process-book' method='post' onsubmit='alert("로봇이 도서를 운반중입니다. 잠시만 기다려주세요.");'>
                        <input type='hidden' value=${bookData[i].ISBN} name='bookISBN'>
                        <img src='./Images/${bookData[i].IMG_NAME}.jpg' alt='${bookData[i].TITLE}' onclick='PageChange(${bookData[i].ISBN});'><span class='imtext'>🔍︎</span>
                        <input type='button' value='${bookData[i].TITLE}'>
                        <br>
                        <input type='submit' value='↪ 가져오기'>
                    </form>
                </th>`;
        bookCnt++;
    }
    const addTh = 5 - (bookCnt % 5);

    for (let i = 0; i < addTh && addTh !== 5; i++) {
        book += `<th class='BookData'></th>`;
    }
    bookElement.innerHTML = book;
    
    pageSortFunc();
}
async function DetailBookInit(){
    const bookElement = document.getElementById('bookDiv');
    let book = "";
    const currentUrl = new URL(window.location.href);
    const isbn = new URLSearchParams(currentUrl.search).get('isbn');

    const bookData = await DetailBookLoad(isbn);

    book += `<img src='./Images/${bookData[0].IMG_NAME}.jpg' alt='${bookData[0].TITLE}' id='bookImg'>
            <div>
                <p><h2 id='bookTitle'>📖 ${bookData[0].TITLE}</h2></p>
                <p><span id='bookTitle'>🔖 저자 ｜ ${bookData[0].AUTHOR}</span></p>
                <p><span id='bookTitle'>🔖 출판사 ｜ ${bookData[0].PUB}</span></p>
                <p><span id='bookTitle'>🔖 출판년도 ｜ ${bookData[0].PUB_YEAR}</span></p>`;
            if(bookData[0].STATUS === "대출 가능"){
                book += `<p><span id='bookTitle' style='color:green'>🚩 ${bookData[0].STATUS}</span></p>`;
            }
            else{
                book += `<p><span id='bookTitle' style='color:red'>🚩 ${bookData[0].STATUS}</span></p>`;
            }
            `</div>`;

    bookElement.innerHTML = book;
}