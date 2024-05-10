let currentPage = 1;
let rowsPerPage = 10;
let queryType = "ItemNewAll";
let searchTarget = "book";
let searchKeyWord = "";
let lastPage = Infinity;
let totalItems = Infinity;
let paginationIndex = 1;
let lastPaginationIndex = Infinity;
let numberOfPaginationButtons = 10;
let dataResultType = "list";

const API_KEY = "ttbsyj94370945002";
const getBaseUrl = (apiEndpoint) =>
  new URL(`http://www.aladin.co.kr/ttb/api/${apiEndpoint}.aspx`);

// 현재 페이지네이션 인덱스 계산
const calculatePaginationIndex = (page) => {
  return page % numberOfPaginationButtons === 0
    ? page / numberOfPaginationButtons
    : Math.ceil(page / numberOfPaginationButtons);
};

// 리스트 불러오거나 검색 결과 불러올 때 페이지 정보 업데이트
const updatePageInfo = (data) => {
  renderBookInfo(data.item);
  renderPagination(data.totalResults);
  lastPage = Math.ceil(data.totalResults / rowsPerPage);
  totalItems = data.totalResults;
  paginationIndex = calculatePaginationIndex(currentPage);
  lastPaginationIndex = calculatePaginationIndex(lastPage);
  currentPage === 1
    ? (prevPageBtn.style.display = "none")
    : (prevPageBtn.style.display = "block");
  currentPage === lastPage
    ? (nextPageBtn.style.display = "none")
    : (nextPageBtn.style.display = "block");
  paginationIndex === 1
    ? (prevPaginationBtn.style.display = "none")
    : (prevPaginationBtn.style.display = "block");
  paginationIndex === lastPaginationIndex
    ? (nextPaginationBtn.style.display = "none")
    : (nextPaginationBtn.style.display = "block");
};

const hamBtn = document.querySelector(".ham");
const closeBtn = document.querySelector(".closeBtn");
hamBtn.addEventListener("click", () => {
  document.body.style.overflow = "hidden";
  categoryTab.classList.toggle("on");
});
document.addEventListener(
  "click",
  (event) => {
    const isClickInside = categoryTab.contains(event.target);

    if (!isClickInside) {
      categoryTab.classList.remove("on");
      document.body.style.overflow = "auto";
    }
  },
  true
);
closeBtn.addEventListener("click", () => {
  categoryTab.classList.remove("on");
  document.body.style.overflow = "auto";
});

// 페이지 이동 핸들러
const handleNavigatePage = (targetPage) => {
  currentPage = targetPage;
  if (dataResultType === "list") {
    getDataJSONP("myCallback", "itemList");
  } else {
    getSearchResult();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 이전 페이지 버튼 클릭 핸들러
const prevPageBtn = document.querySelector(".fa-angle-left");
prevPageBtn.addEventListener("click", () => {
  if (currentPage === 1) return;
  handleNavigatePage(currentPage - 1);
});

// 다음 페이지 버튼 클릭 핸들러
const nextPageBtn = document.querySelector(".fa-angle-right");
nextPageBtn.addEventListener("click", () => {
  if (currentPage === lastPage) return;
  handleNavigatePage(currentPage + 1);
});

// 이전 페이지네이션 버튼 클릭 핸들러
const prevPaginationBtn = document.querySelector(".fa-angles-left");
const calculatePrevStartingPage = (page) => {
  if (page <= numberOfPaginationButtons) {
    return 1;
  } else if (page % numberOfPaginationButtons === 0) {
    return page - (2 * numberOfPaginationButtons - 1);
  } else {
    return (
      Math.floor(page / numberOfPaginationButtons) * numberOfPaginationButtons -
      numberOfPaginationButtons +
      1
    );
  }
};
prevPaginationBtn.addEventListener("click", () => {
  if (currentPage === 1) return;
  const targetPage = calculatePrevStartingPage(currentPage);
  handleNavigatePage(targetPage);
});

// 다음 페이지네이션 버튼 클릭 핸들러
const nextPaginationBtn = document.querySelector(".fa-angles-right");
const calculateNextStartingPage = (page) => {
  if (page % numberOfPaginationButtons === 0) {
    return page + 1;
  } else {
    return (
      Math.floor(page / numberOfPaginationButtons) * numberOfPaginationButtons +
      numberOfPaginationButtons +
      1
    );
  }
};
nextPaginationBtn.addEventListener("click", () => {
  if (currentPage === lastPage) return;
  const targetPage = calculateNextStartingPage(currentPage);
  handleNavigatePage(targetPage);
});

// pagination
const renderPagination = (totalItems) => {
  const paginationCon = document.querySelector(".pagination");

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  let paginationHTML = "";

  const startPageNum =
    (Math.ceil(currentPage / numberOfPaginationButtons) - 1) *
      numberOfPaginationButtons +
    1;

  const endPageNum = Math.min(
    startPageNum + numberOfPaginationButtons - 1,
    totalPages
  );

  for (let i = startPageNum; i <= endPageNum; i++) {
    paginationHTML += `<button class="pageBtn ${
      i === currentPage ? "clicked" : ""
    }">${i}</button>`;
  }
  paginationCon.innerHTML = paginationHTML;

  const pageButtons = document.querySelectorAll(".pageBtn");

  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleNavigatePage(Number(button.textContent));
    });
  });
};

// 화면 너비에 따라 페이지네이션 버튼 수 조정
const setNumberOfPaginationButtons = () => {
  numberOfPaginationButtons = window.innerWidth > 600 ? 10 : 5;
  renderPagination(totalItems);
};

setNumberOfPaginationButtons();
window.addEventListener("resize", setNumberOfPaginationButtons);

// 검색 인풋 및 버튼 핸들러
const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".searchBar input");
const searchResultInfo = document.querySelector("#searchResultInfo");

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

searchInput.addEventListener("focus", () => {
  searchInput.setAttribute("placeholder", "");
});

searchBtn.addEventListener("click", () => {
  dataResultType = "search";
  searchKeyWord = searchInput.value;
  currentPage = 1;

  getSearchResult();
});

// 검색 결과 호출
const getSearchResult = async () => {
  const searchUrl = new URL(
    `https://port-0-aladin-api-k19y2kljnp6r89.sel4.cloudtype.app/search`
  );

  searchUrl.searchParams.append("Query", searchKeyWord);
  searchUrl.searchParams.append("MaxResults", rowsPerPage);
  searchUrl.searchParams.append("Start", currentPage);
  searchUrl.searchParams.append("QueryType", "Keyword");
  searchUrl.searchParams.append("SearchTarget", searchTarget);
  searchUrl.searchParams.append("Cover", "Big");

  const response = await fetch(searchUrl);
  const data = await response.json();
  console.log(data);

  updatePageInfo(data);
  searchResultInfo.textContent = `"${searchKeyWord}" 검색 결과`;
};

// tab클릭
const categoryTab = document.querySelector(".categoryTab");
categoryTab.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  searchResultInfo.remove();

  document.querySelectorAll(".categoryTab button").forEach((button) => {
    button.classList.remove("active");
  });

  currentPage = 1;

  if (e.target.dataset.tab === "ItemNewAll") {
    queryType = "ItemNewAll";
    searchTarget = "book";
  } else {
    queryType = "Bestseller";
    searchTarget = e.target.dataset.tab;
  }
  searchInput.value = "";

  e.target.classList.add("active");
  dataResultType = "list";
  getDataJSONP("myCallback", "itemList");
});

// 페이지당 행 수 옵션
const rowsPerPageOption = [
  {
    name: "10개씩",
    value: 10,
  },

  {
    name: "30개씩",
    value: 30,
  },

  {
    name: "50개씩",
    value: 50,
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
  rowsPerPage = Number(e.target.value);
  getDataJSONP("myCallback", "itemList");
});

// 책 정보 렌더링
const renderBookInfo = (books) => {
  const bookListContainer = document.getElementById("bookInfoList");
  let ulHTML = `<ul>`;
  books.forEach((book, i) => {
    ulHTML += `
    <li>
      <div class="bookInfoWrap">
        <div>${(currentPage - 1) * rowsPerPage + i + 1}</div>
        <a href = "${book.link}" class="bookImg">
          <img src="${book.cover}" alt="${book.title}" 
      class="bookCoverImage" /></a>
        <div class="bookInfo">
          <div class="bookTitle">
            <span>${book.categoryName}</span>
            <a href = "${book.link}">${book.title}</a>
            </div>
          <div class="issueInfo">
            <div>${book.author} | ${book.publisher} | ${book.pubDate}</div>
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

// 데이터 불러오기
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
  baseUrl.searchParams.append("Cover", "MidBig");

  if (endpoint === "ItemSearch")
    baseUrl.searchParams.append("Query", searchKeyWord);

  let script = document.querySelector("#jsonp");

  // 이전에 생성된 스크립트 태그가 있다면 삭제
  if (script) {
    script.remove();
  }
  script = document.createElement("script");
  script.id = "jsonp";
  script.src = baseUrl;

  // 콜백 함수 설정
  window[callbackName] = (data, error) => {
    // console.log("fetched data", data);
    if (error) {
      return alert(error.errorMessage);
    }

    updatePageInfo(data);

    delete window[callbackName];
  };

  document.body.appendChild(script);
};

// 초기 리스트 JSONP 요청 보내기
getDataJSONP("myCallback", "ItemList");
