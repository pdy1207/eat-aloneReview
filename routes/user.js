var router = require("express").Router();

function loginSuccess(req, res, next) {
  if (req.user) {
    next(); // req.user가 있으면 next() 통과
  } else {
    res.render("login.ejs");
    // req.user가 없으면 경고 메세지
  }
}

router.get("/login", function (req, res) {
  // res.sendFile(path.join(__dirname + "/", "views", "login.html"));
  res.render("login.ejs");
});

router.get("/signup", function (req, res) {
  res.render("signup.ejs");
});
router.get("/info", loginSuccess, function (req, res) {
  res.render("mypage.ejs", { user: req.user });
});

// 로그아웃 라우트
router.get("/logout", (req, res) => {
  // 세션을 제거하려면 세션 미들웨어에서 제공하는 destroy 함수를 호출
  console.log("로그아웃 요청");
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 제거 오류:", err);
    }
    // 로그아웃 후 리디렉션할 경로
    res.redirect("/");
  });
});

module.exports = router;
