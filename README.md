# 💻 geniebook
알라딘 OpenAPI를 활용한 프로젝트
### 💡 geniebook 웹사이트 소개
- 도서 및 음반을 카테고리별 정렬 및 검색할 수 있는 웹사이트 
### 🗓️ 개발 기간
- 기간: 2024년 4월 19일 ~ 2024년 4월 26일

### 🛠️ 사용한 기술
 ![HTML5 badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
 ![CSS3 badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) 
 ![JavaScript badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
### ✅ 구현한 기능
- 카테고리별 정렬
- 제목, 저자, 출판사를 입력해서 특정 도서나 음반 검색
- 페이지네이션
- n개씩 보기
- 반응형 디자인 구현
### 👩🏻‍💻 구현한 화면
![image](https://github.com/newjinny/geniebook/assets/91702975/364ca525-c494-4b1b-ba77-f60ccce3d6eb)
### 💣 이슈 및 해결
&emsp;**1. CORS 오류로 인한 데이터 불러오기 실패**  
&emsp;&emsp;✔️ CORS 문제를 우회하기 위해 서버 측에서 JSON 데이터를 동적으로 생성하는 JSONP를 사용하여 데이터를 요청

&emsp;**2. 검색 API의 접근 제한으로 인한 데이터 불러오기 제한**  
&emsp;&emsp;✔️ Node.js 활용하여 서버 구축 후 API 요청
