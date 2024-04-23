let currentPage = "1";
let rowsPerPage = "10";
let queryType = "ItemNewAll";
let searchTarget = "book";
let searchKeyWord = "";

const API_KEY = "ttbsyj94370945002";
const getBaseUrl = (apiEndpoint) =>
  new URL(`http://www.aladin.co.kr/ttb/api/${apiEndpoint}.aspx`);

//검색
const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".searchBar input");
searchBtn.addEventListener("click", () => {
  searchKeyWord = searchInput.value;

  getDataJSONP("myCallback", "ItemSearch");
});
//tab클릭
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
  getDataJSONP("myCallback", "itemList");
});

// 페이지당 행 수 옵션
const rowsPerPageOption = [
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
rowsPerPageOption.forEach((rowsOption) => {
  const option = document.createElement("option");
  option.value = rowsOption.value;
  option.text = rowsOption.name;
  selectRowsPerPage.appendChild(option);
});

// 페이지당 행 수 변경 이벤트 핸들러
selectRowsPerPage.addEventListener("change", (e) => {
  rowsPerPage = e.target.value;
  getDataJSONP("myCallback", "itemList");
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
const getDataJSONP = (callbackName, endpoint) => {
  const baseUrl = getBaseUrl(endpoint);

  baseUrl.searchParams.append("ttbkey", API_KEY);
  baseUrl.searchParams.append("QueryType", queryType);
  baseUrl.searchParams.append("SearchTarget", searchTarget);
  baseUrl.searchParams.append("MaxResults", rowsPerPage);
  baseUrl.searchParams.append("start", currentPage);
  baseUrl.searchParams.append("output", "js");
  baseUrl.searchParams.append("Version", "20131101");
  baseUrl.searchParams.append("callback", callbackName);

  if (endpoint === "ItemSearch")
    baseUrl.searchParams.append("Query", searchKeyWord);
  const script = document.createElement("script");
  // JSONP 서버의 URL 설정
  script.src = baseUrl;
  // 콜백 함수 설정
  window[callbackName] = (data) => {
    console.log("fetched data", data);
    renderBookInfo(data.item);

    delete window[callbackName];
  };

  document.body.appendChild(script);
};
// JSONP 요청 보내기
getDataJSONP("myCallback", "ItemList");
