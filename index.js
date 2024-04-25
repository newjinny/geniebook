let currentPage = 1;
let rowsPerPage = 10;
let queryType = "ItemNewAll";
let searchTarget = "book";
let searchKeyWord = "";
let lastPage = Infinity;
let totalItems = Infinity;
let numberOfPaginationButtons = 10;

const API_KEY = "ttbsyj94370945002";
const getBaseUrl = (apiEndpoint) =>
  new URL(`http://www.aladin.co.kr/ttb/api/${apiEndpoint}.aspx`);

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

const handleNavigatePage = (targetPage) => {
  currentPage = targetPage;
  getDataJSONP("myCallback", "itemList");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const prevPageBtn = document.querySelector(".fa-angle-left");
prevPageBtn.addEventListener("click", () => {
  if (currentPage === 1) return;
  handleNavigatePage(currentPage - 1);
});

const nextPageBtn = document.querySelector(".fa-angle-right");
nextPageBtn.addEventListener("click", () => {
  if (currentPage === lastPage) return;
  handleNavigatePage(currentPage + 1);
});

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

//pagination
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

const setNumberOfPaginationButtons = () => {
  console.log(window.innerWidth);
  if (window.innerWidth > 600) {
    numberOfPaginationButtons = 10;
    renderPagination(totalItems);
  } else {
    numberOfPaginationButtons = 5;
    renderPagination(totalItems);
  }
};

setNumberOfPaginationButtons();

window.addEventListener("resize", setNumberOfPaginationButtons);

//pagination
// const renderPagination = (totalItems) => {
//   const paginationCon = document.querySelector(".pagination");
//   const totalPages = Math.ceil(totalItems / rowsPerPage);
//   let paginationHTML = "";
//   for (let i = 1; i <= totalPages; i++) {
//     if (i <= totalPages / 10) {
//       paginationHTML += `<button class="pageBtn ${
//         i === Number(currentPage) ? "clicked" : ""
//       }">${i}</button>`;
//     }
//   }
//   paginationCon.innerHTML = paginationHTML;

//   const pageButtons = document.querySelectorAll(".pageBtn");
//   pageButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       currentPage = button.textContent;
//       getDataJSONP("myCallback", "itemList");
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       document.body.style.overflow = "auto";
//     });
//   });
// };

//검색;
const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".searchBar input");
searchBtn.addEventListener("click", () => {
  searchKeyWord = searchInput.value;
  // getSearchResult();
  getDataJSONP("myCallback", "ItemSearch");
});

// const getSearchResult = async () => {
//   const searchUrl = new URL(
//     `https://port-0-aladin-api-k19y2kljnp6r89.sel4.cloudtype.app/search`
//   );

//   searchUrl.searchParams.append("Query", searchKeyWord);
//   searchUrl.searchParams.append("MaxResults", rowsPerPage);
//   searchUrl.searchParams.append("start", currentPage);
//   searchUrl.searchParams.append("QueryType", "Keyword");
//   searchUrl.searchParams.append("SearchTarget", searchTarget);

//   const response = await fetch(searchUrl);
//   const data = await response.json();
//   console.log(data);

//   renderBookInfo(data.item);
//   renderPagination(data.totalResults);
// };

// tab클릭
const categoryTab = document.querySelector(".categoryTab");
categoryTab.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

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

  e.target.classList.add("active");
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

const renderBookInfo = (books) => {
  const bookListContainer = document.getElementById("bookInfoList");
  let ulHTML = `<ul>`;
  books.forEach((book, i) => {
    ulHTML += `<li>
      <div class="bookInfoWrap">
        <div>${(currentPage - 1) * rowsPerPage + i + 1}</div>
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

  let script = document.querySelector("#jsonp");
  if (script) {
    script.remove();
  }
  script = document.createElement("script");
  script.id = "jsonp";
  // // JSONP 서버의 URL 설정
  script.src = baseUrl;
  document.body.appendChild(script);
  // 콜백 함수 설정
  window[callbackName] = (data, error) => {
    console.log("fetched data", data);
    if (error) {
      return alert(error.errorMessage);
    }
    renderBookInfo(data.item);
    renderPagination(data.totalResults);

    delete window[callbackName];
  };

  document.body.appendChild(script);
};
// JSONP 요청 보내기
getDataJSONP("myCallback", "ItemList");
