// 책 정보 전부 가져오기
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
async function BookInit(pageSortFunc){
    const bookElement = document.getElementById('BookRow');
    let book = "";

    const bookData = await BookLoad();

    let bookCnt = 0;
    for (let i = 0; i < bookData.length; i++) {
        book += `<th class='BookData'>
                    <input type='hidden' value=${bookData[i].ISBN} name='bookISBN'>
                    <img src='./Images/${bookData[i].IMG_NAME}.jpg' alt='${bookData[i].TITLE}' onclick='PageChange(${bookData[i].ISBN});'><span class='imtext'>🔍︎</span>
                    <input type='button' value='${bookData[i].TITLE}'>
                    <br>
                    <input type='submit' value='↪ 가져오기'>
                </th>`;
        bookCnt++;
    }
    const addTh = 5 - (bookCnt % 5);

    for (let i = 0; i < addTh; i++) {
        book += `<th class='BookData'></th>`;
    }

    bookElement.innerHTML = book;
    
    pageSortFunc();
}