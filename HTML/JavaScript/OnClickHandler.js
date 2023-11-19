// 요소 클릭시 페이지 이동
function InitOnClick(bookID){
    const btnDetail = document.getElementsByClassName("detail");
    const btnLoan = document.getElementsByClassName("load");

    var detailURL = "ShowDetail.html/bookID=" + bookID;
    for(idx = 0; idx < btnDetail.length; idx++){
        btnDetail[idx].addEventListener("click", window.location.href = detailURL);
        btnLoan[idx].addEventListener("click", window.location.href = detailURL);
    }
}