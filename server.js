const express = require("express");
const app = express();
const path = require("path"); // 파일 폴더 가져오기
const bodyParser = require("body-parser"); // post 요청시 필수 라이브러리
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* image 저장 경로 파일 */

let multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img"); // public/image 폴더 안에 이미지 저장
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 어떤 파일명으로 저장하고싶은지 ?
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("PNG, JPG만 업로드하세요"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
var upload = multer({ storage: storage });
/* 
  form put delete 작성 가능
*/
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

/* 
  session
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "1q2w3e4r", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

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
// test page
app.get("/test", function (res, req) {
  req.render("test.ejs");
});

function loginSuccess(req, res, next) {
  if (req.user) {
    next(); // req.user가 있으면 next() 통과
  } else {
    res.render("login.ejs");
    // req.user가 없으면 경고 메세지
  }
}

app.use("/user", require("./routes/user.js"));

// review 관련 page
app.get("/review-list", async function (req, res) {
  await db
    .collection("review-list")
    .find()
    .toArray(function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 오류");
      }

      res.render("review-list.ejs", { reviewList: result });
    });
});

app.get("/review/:id", async function (req, res) {
  const loginLinkText = req.isAuthenticated() ? "로그아웃" : "로그인";
  const loginLinkTextURL = req.isAuthenticated() ? "logout" : "login";
  const requestedId = req.params.id; // 동적으로 :id 파라미터의 값을 가져옴

  // 두 개의 컬렉션에서 데이터를 가져옴
  await db.collection("review-list").findOne(
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

          // 이미지 경로를 각 리뷰에 포함시킴
          for (const review of reviewResults) {
            review.imageUrl = `./public/img/${review.imageURL}`;
          }

          // 가져온 데이터를 렌더링에 전달
          res.render("review.ejs", {
            data: reviewListResult,
            reviews: reviewResults, // 여러 개의 결과를 배열로 전달
            total: totalReviews,
            loginLinkText: loginLinkText,
            loginLinkTextURL: loginLinkTextURL,
          });
        });
    }
  );
});

app.post(
  "/review-add",
  loginSuccess,
  upload.single("photo"),
  async function (req, res) {
    const requestedId = req.body.urlId;
    const imagePath = req.file ? `${req.file.filename}` : null;

    await db.collection("review").insertOne(
      {
        content: req.body.reviewText,
        score: req.body.rating,
        postId: req.body.urlId,
        date: new Date(),
        imageURL: imagePath,
      },
      function (err, result) {
        console.log("리뷰 작성 완료!");
        res.redirect("/review/" + requestedId);
      }
    );
  }
);

app.delete("/delete", loginSuccess, function (req, res) {
  console.log(req.body._id);
  var idVal = req.body._id;
  var objectId = new ObjectId(idVal);
  console.log(idVal);
  db.collection("review").deleteOne({ _id: objectId }, function (에러, 결과) {
    console.log(`${idVal}의 해당 데이터를 삭제 완료 하였습니다.`);
    res.status(200).send({ message: "성공했습니다" });
  });
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/user/signup" }),
  function (req, res) {
    res.redirect("/");
  }
);

// 회원가입
app.post("/register", function (req, res) {
  db.collection("login").insertOne(
    {
      userKey: req.body.userKey,
      userID: req.body.userID,
      txtIntro: req.body.txtIntro,
      txtPW: req.body.txtPW,
      date: new Date(),
    },
    function (err, result) {
      res.redirect("/user/login");
    }
  );
});

// 수정
app.post("/edit", async function (req, res) {
  await db.collection("login").updateOne(
    {
      _id: ObjectId(req.body.id),
    },
    {
      $set: {
        userKey: req.body.userKey,
        userID: req.body.userID,
        txtIntro: req.body.txtIntro,
        txtPW: req.body.txtPW,
      },
    },
    function (err, result) {
      console.log("수정완료!");
      res.redirect("/user/info");
    }
  );
});

// 검색
app.get("/search", loginSuccess, async (req, res) => {
  const requestedTitle = req.query.value; // 검색어를 query parameter로부터 가져옴

  // review-list에서 title로 검색
  await db.collection("review-list").findOne(
    {
      title: requestedTitle,
    },
    function (err, reviewListResult) {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 오류");
      }

      if (!reviewListResult) {
        // 검색 결과가 없을 때 예외 처리
        return res.render("error.ejs", {
          query: requestedTitle, // 검색어를 전달
        });
      }

      const requestedId = reviewListResult._id; // 검색 결과에서 _id 가져옴
      // review 컬렉션에서 검색
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

passport.use(
  new LocalStrategy(
    {
      usernameField: "userKey",
      passwordField: "userEmail",
      session: true,
      passReqToCallback: false,
    },
    function (userKey, userEmail, done) {
      // console.log(userKey, userEmail);
      db.collection("login").findOne(
        { userKey: userKey },
        function (err, result) {
          if (err) return done(result);

          if (!result)
            return done(null, false, { message: "사용자를 찾을 수 없습니다." });
          if (userEmail == result.userID) {
            return done(null, result);
          } else {
            return done(null, false, { message: "비밀번호가 틀렸습니다." });
          }
        }
      );
    }
  )
);

/* 
 세션 만들기
 세션 저장시키는 코드 (로그인 성공시 발동) 
 id를 이용하여 세션을 저장시키는 코드 (로그인 성공시 발동)
 세션 데이터를 만들고 세션의 ID정보를 쿠키로 보냄
*/
passport.serializeUser(function (user, done) {
  done(null, user.userKey);
});

/* 
  나중에
  이 세션 데이터를 가진 사람을 DB에서 찾아 주세요(마이페이지 접속시 발동)
*/
passport.deserializeUser(function (아이디, done) {
  db.collection("login").findOne({ userKey: 아이디 }, function (에러, 결과) {
    done(null, 결과);
  });
});

//기본 페이지 로드 200
app.get("/", function (req, res) {
  const loginLinkText = req.isAuthenticated() ? "로그아웃" : "로그인";
  const loginLinkTextURL = req.isAuthenticated() ? "logout" : "login";
  res.render("index.ejs", { loginLinkText, loginLinkTextURL });
});

//에러 페이지 로드 404
app.all("*", function (req, res) {
  res.status(404).render("error.ejs");
});
