const express = require("express");
const app = express();
const path = require("path"); // 파일 폴더 가져오기
const bodyParser = require("body-parser"); // post 요청시 필수 라이브러리
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var db;
/* 몽고 DB 접속 코드 */
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(process.env.DB_URL, function (err, client) {
  if (err) return console.log(err);

  db = client.db("eatalonereviewapp");

  app.listen(process.env.PORT, function () {
    console.log("8081포트 열렸으며, DB에도 접속완료하였습니다.");
  });
});

app.get("/login", function (요청, 응답) {
  // 응답.sendFile(path.join(__dirname + "/", "views", "login.html"));
  응답.render("login.ejs");
});

app.get("/user", function (요청, 응답) {
  응답.render("mypage.ejs");
});

app.get("/review-list", function (req, res) {
  db.collection("review-list")
    .find()
    .toArray(function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 오류");
      }

      res.render("review-list.ejs", { reviewList: result });
    });
});

app.get("/review/:id", function (req, res) {
  const requestedId = req.params.id; // 동적으로 :id 파라미터의 값을 가져옴

  // 두 개의 컬렉션에서 데이터를 가져옴
  db.collection("review-list").findOne(
    {
      _id: ObjectId(requestedId),
    },
    function (err, reviewListResult) {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 오류");
      }

      db.collection("review")
        .find({
          postId: requestedId,
        })
        .toArray(function (err, reviewResults) {
          if (err) {
            console.error(err);
            return res.status(500).send("서버 오류");
          }

          // 리뷰의 총 개수 계산
          const totalReviews = reviewResults.length;

          // 가져온 데이터를 렌더링에 전달
          res.render("review.ejs", {
            data: reviewListResult,
            reviews: reviewResults, // 여러 개의 결과를 배열로 전달
            total: totalReviews,
          });
        });
    }
  );
});

app.post("/review-add", function (req, res) {
  const requestedId = req.body.urlId;
  db.collection("review").insertOne(
    {
      content: req.body.reviewText,
      score: req.body.rating,
      postId: req.body.urlId,
      date: new Date(),
    },
    function (err, result) {
      console.log("리뷰 작성 완료!");
      res.redirect("/review/" + requestedId);
    }
  );
});

app.get("/signup", function (요청, 응답) {
  응답.render("signup.ejs");
});

// test page
app.get("/test", function (res, req) {
  req.render("test.ejs");
});

//기본 페이지 로드 200
app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});

//에러 페이지 로드 404
app.all("*", function (req, res) {
  res.status(404).render("error.ejs");
});
