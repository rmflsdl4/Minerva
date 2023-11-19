let bookData = BookLoad();
// 책 정보 전부 가져오기
async function BookLoad(){
    return new Promise((resolve, reject) => {
        fetch('/book-load', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
        })
			.then(response => response.json())
            .then(data => {
                const result = data;
                
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}