const express = require('express')
const app = express()
const port = 3000

const connect = require("./schemas");
connect();

// post, form 요청에 필요하다고 함. 
// body로 전달 받은 JSON 데이터를 바로 사용할 수 없고 expres에서 제공하는 미들웨어를 써줘야한다고 함.
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'))

//articlesRouter 라우팅
// const router = express.Router();
const articlesRouter = require("./routes/articles");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
app.use("/blog", [articlesRouter]);
app.use("/blog", [commentsRouter]);
app.use("/", [usersRouter]);

// set the view engine to ejs
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
    res.render("main");
});

// signin page
app.get("/signin", function (req, res) {
    res.render("signin");
});

//signup page
app.get("/signup", function (req, res) {
    res.render("signup");
});

//detail page
app.get("/detail", function (req, res) {
    res.render("detail")
})

//write page
app.get("/write", function (req, res) {
    res.render("write");
})

//edit page
app.get('/edit', function (req, res) {
    res.render('edit');
})

// port 연결
app.listen(port, () => {
  console.log(`port ${port}번으로 연결되었습니다.`)
})

