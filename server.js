const express = require("express");
const app = express();
const path = require("path"); // 파일 폴더 가져오기
const bodyParser = require("body-parser"); // post 요청시 필수 라이브러리
const ObjectId = require("mongodb").ObjectId;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var db;
/* 몽고 DB 접속 코드 */
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://adminmaster:qwer1234@cluster0.zap7sas.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);

    db = client.db("eatalonereviewapp");

    app.listen(8081, function () {
      console.log("8081포트 열렸으며, DB에도 접속완료하였습니다.");
    });
  }
);

app.get("/login", function (요청, 응답) {
  // 응답.sendFile(path.join(__dirname + "/", "views", "login.html"));
  응답.render("login.ejs");
});
app.get("/user", function (요청, 응답) {
  응답.render("mypage.ejs");
});
app.get("/review/:id", function (req, res) {
  const requestedId = req.params.id; // 동적으로 :id 파라미터의 값을 가져옴
  db.collection("review-list").findOne(
    {
      _id: ObjectId(requestedId),
    },
    function (err, result) {
      console.log(result);
      res.render("review.ejs", { data: result });
      if (result === null) {
        res.status(404).send("Error 404");
      }
    }
  );
});
app.get("/signup", function (요청, 응답) {
  응답.render("signup.ejs");
});
app.get("/review-list", function (req, res) {
  db.collection("review-list")
    .find()
    .toArray(function (err, result) {
      console.log(result);
      res.render("review-list.ejs", { reviewList: result });
    });
});

//기본 페이지 로드 200
app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});

//에러 페이지 로드 404

app.all("*", function (req, res) {
  res.status(404).render("error.ejs");
});
