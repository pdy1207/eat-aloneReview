const express = require("express");
const app = express();

app.listen(8081, function () {
  console.log("listening on 8081");
});

// == 기본 셋팅

// nodemon으로 서버 재실행 자동화하기 npm install -g nodemon

app.use("/public", express.static("public"));

// css 사용

app.get("/", function (요청, 응답) {
  응답.sendFile(__dirname + "/index.html");
});
app.get("/login", function (요청, 응답) {
  응답.sendFile(__dirname + "/login.html");
});
app.get("/MyPage", function (요청, 응답) {
  응답.sendFile(__dirname + "/mypage.html");
});
app.get("/Review", function (요청, 응답) {
  응답.sendFile(__dirname + "/review.html");
});
