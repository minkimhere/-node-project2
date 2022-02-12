const express = require('express');
const router = express.Router();
const Article = require('../schemas/article');
const AuthMiddleware = require('../middlewares/authMiddleware');

//글쓰기 create
router.post('/write', AuthMiddleware, async (req, res) => {
  const { postId, title, content } = req.body;
  const date = new Date().toLocaleString('ko-KR');
  const nickname = res.locals.user.nickname;
  // console.log(nickname, date);
  await Article.create({ postId, title, content, nickname, date });
  res.json({ result: 'success' });
});

// 메인페이지 게시글 보기 read
router.get('/article', async (req, res) => {
  try {
    const article = await Article.find().sort('-postId');
    res.json({ article });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// 상세페이지 게시글 보기 read
router.get('/detail/:postId', async (req, res) => {
  const { postId } = req.params;
  const article = await Article.findOne({ postId });
  // const nickname = res.locals.user.nickname;

  res.json({ article });
  // res.status(200).render('detail', { article });
});

// 글 수정하기 update
router.put('/edit/:postId', AuthMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const loginNickname = res.locals.user.nickname; // 로그인한 사용자

  const [articleNick] = await Article.find({ postId: postId }); // 현재 게시글 찾기
  const articleNickname = articleNick.nickname; // 게시글 작성자

  // console.log(loginNickname, articleNickname);

  const article = await Article.find({ postId: postId }); // 현재 게시글 찾기

  if (loginNickname !== articleNickname) {
    // 작성자가 아니라면 다르면 돌려보내기
    return res.send({
      success: false,
      msg: '본인의 게시물만 수정할 수 있습니다.',
    });
  }
  if (article.length) {
    // 있으면 수정하기
    await Article.updateOne({ postId: postId }, { $set: { title, content } });
  }
  res.json({ success: true, msg: '수정이 완료되었습니다.' });
});

// 글 삭제 delete
router.delete('/delete/:postId', AuthMiddleware, async (req, res) => {
  const { postId } = req.params; // 삭제할 번호

  const loginNickname = res.locals.user.nickname; // 로그인한 사용자
  const [articleNick] = await Article.find({ postId: postId }); // 현재 게시글 찾기
  const articleNickname = articleNick.nickname; // 게시글 작성자

  const article = await Article.find({ postId: postId }); // 현재 게시글 찾기
  if (loginNickname !== articleNickname) {
    // 작성자가 아니라면 다르면 돌려보내기
    return res.send({ success: false, msg: '잘못된 요청입니다.' });
  }
  if (article.length) {
    // 있으면 삭제
    await Article.deleteOne({ postId: postId });
  }
  res.json({ result: 'success', msg: '삭제가 완료되었습니다.' });
});

module.exports = router;

// 오류났던 코드
// const article = await Article.find({ postId: postId });
// if (articleNickname !== loginNickname) { // 아이디 다르면 돌려보내기
//   return res.send({ success: false, 'msg': "잘못된 요청입니다." });
// } else {
//   if (article.length) { // 있으면 수정하기
//     await Article.updateOne({ postId: postId }, { $set: { title, content } });
//     res.json({ result: "success", 'msg': '수정이 완료되었습니다.' });
//   }
// }
