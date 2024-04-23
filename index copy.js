const API_KEY = "ttbsyj94370945002";

const renderBookInfo = (books) => {
  const bookListContainer = document.getElementById("bookInfoList");
  let ulHTML = `<ul>`;
  books.forEach((book) => {
    ulHTML += `<li>
      <div class="bookInfoWrap">
        <span>${book.bestRank}</span>
        <div class="bookImg">
          <img src="${book.cover}" alt="${book.title}" class="bookCoverImage" />
        </div>
        <div class="bookInfo">
          <div class="bookTitle">
            <span>${book.categoryName}</span>
            <a href = "${book.link}">${book.title}</a>
            </div>
          <div class="issueInfo">
            <div>${book.author}</div>
            <div>${book.publisher}</div>
            <time>${book.pubDate}</time>
          </div>
          <div class="priceInfo">
            <span class="priceStandard">${book.priceStandard.toLocaleString()}원</span>
            <span class="priceSales">${book.priceSales.toLocaleString()}원</span>
          </div>
          <p>${book.description}</p>
        </div>
      </div>
    </li>`;
  });
  ulHTML += `</ul>`;

  bookListContainer.innerHTML = ulHTML;
};

const getBookListJSONP = (callbackName, params) => {
  const { queryType, searchTarget, maxResults, start } = params;
  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${API_KEY}&QueryType=${queryType}&SearchTarget=${searchTarget}&MaxResults=${maxResults}&start=${start}&output=js&Version=20131101&callback=${callbackName}`;

  const script = document.createElement("script");
  // JSONP 서버의 URL 설정
  script.src = url;
  // 콜백 함수 설정
  window[callbackName] = (data) => {
    console.log(data.item);
    renderBookInfo(data.item);

    delete window[callbackName];
  };

  document.body.appendChild(script);
};
// JSONP 요청 보내기
getBookListJSONP("myCallback", {
  queryType: "Bestseller",
  searchTarget: "Book",
  maxResults: 10,
  start: 1,
});
// const API_KEY = "ttbsyj94370945002";
// const url = new URL(`http://www.aladin.co.kr/ttb/api/ItemList.aspx`);

// const getBookList = async () => {
//   try {
//     url.searchParams.append("ttbkey", API_KEY);
//     url.searchParams.append("QueryType", "Bestseller");
//     url.searchParams.append("SearchTarget", "Book");
//     url.searchParams.append("MaxResults", 10);
//     url.searchParams.append("start", 1);
//     url.searchParams.append("output", "js");
//     url.searchParams.append("Version", "20131101");

//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// };
// getBookList();
