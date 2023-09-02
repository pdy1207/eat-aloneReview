const express = require("express");
const app = express();
const path = require("path"); // 파일 폴더 가져오기

app.listen(8081, function () {
  console.log("listening on 8081");
});

/* 
 == 기본 셋팅
 nodemon으로 서버 재실행 자동화하기 npm install -g nodemon
 */

app.use("/public", express.static("public"));

// css 사용

app.get("/", function (요청, 응답) {
  응답.sendFile(path.join(__dirname + "/", "views", "index.html"));
});
app.get("/login", function (요청, 응답) {
  응답.sendFile(path.join(__dirname + "/", "views", "login.html"));
});
app.get("/MyPage", function (요청, 응답) {
  응답.sendFile(path.join(__dirname + "/", "views", "mypage.html"));
});
app.get("/Review", function (요청, 응답) {
  응답.sendFile(path.join(__dirname + "/", "views", "review.html"));
});
