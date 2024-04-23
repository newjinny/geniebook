let currentPage = "1";
let rowsPerPage = "10";
let queryType = "ItemNewAll";
let searchTarget = "book";

const categoryTab = document.querySelector(".categoryTab");
categoryTab.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  document.querySelectorAll(".categoryTab button").forEach((button) => {
    button.classList.remove("active");
  });

  if (e.target.dataset.tab === "ItemNewAll") {
    queryType = "ItemNewAll";
    searchTarget = "book";
  } else {
    queryType = "Bestseller";
    searchTarget = e.target.dataset.tab;
  }

  e.target.classList.add("active");
  getBookListJSONP("myCallback");
});

const API_KEY = "ttbsyj94370945002";
const getBaseUrl = (apiEndpoint) =>
  new URL(`http://www.aladin.co.kr/ttb/api/${apiEndpoint}.aspx`);

// const searchBaseUrl = getBaseUrl("ItemSearch");
// const detailBaseUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
// 페이지당 행 수 옵션
const ROWS_PER_PAGE_OPTIONS = [
  {
    name: "10개씩 보기",
    value: "10",
  },

  {
    name: "30개씩 보기",
    value: "30",
  },

  {
    name: "50개씩 보기",
    value: "50",
  },
];

// 페이지당 행 수 select 태그
const selectRowsPerPage = document.getElementById("rowsPerPage");

// 페이지당 행 수 select 태그에 option 태그 추가
ROWS_PER_PAGE_OPTIONS.forEach((rowsOption) => {
  const option = document.createElement("option");
  option.value = rowsOption.value;
  option.text = rowsOption.name;
  selectRowsPerPage.appendChild(option);
});

// 페이지당 행 수 변경 이벤트 핸들러
selectRowsPerPage.addEventListener("change", (e) => {
  rowsPerPage = e.target.value;

  getBookListJSONP("myCallback");
});

const renderBookInfo = (books) => {
  const bookListContainer = document.getElementById("bookInfoList");
  let ulHTML = `<ul>`;
  books.forEach((book, i) => {
    ulHTML += `<li>
      <div class="bookInfoWrap">
        <div>${i + 1}</div>
        <div class="bookImg">
        <a href = "${book.link}">
          <img src="${book.cover}" alt="${
      book.title
    }" class="bookCoverImage" /></a>
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

//데이터 불러오기
const getBookListJSONP = (callbackName) => {
  const listBaseUrl = getBaseUrl("ItemList");

  listBaseUrl.searchParams.append("ttbkey", API_KEY);
  listBaseUrl.searchParams.append("QueryType", queryType);
  listBaseUrl.searchParams.append("SearchTarget", searchTarget);
  listBaseUrl.searchParams.append("MaxResults", rowsPerPage);
  listBaseUrl.searchParams.append("start", currentPage);
  listBaseUrl.searchParams.append("output", "js");
  listBaseUrl.searchParams.append("Version", "20131101");
  listBaseUrl.searchParams.append("callback", callbackName);

  const script = document.createElement("script");
  // JSONP 서버의 URL 설정
  script.src = listBaseUrl;
  // 콜백 함수 설정
  window[callbackName] = (data) => {
    console.log("fetched data", data);
    renderBookInfo(data.item);

    delete window[callbackName];
  };

  document.body.appendChild(script);
};
// JSONP 요청 보내기
getBookListJSONP("myCallback");
