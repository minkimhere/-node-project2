const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const AuthMiddleware = require('../middlewares/authMiddleware');

//댓글쓰기 create
router.post('/comment/:commentPostId', AuthMiddleware, async (req, res) => {
  const { comment, commentId } = req.body; //댓글, 댓글 번호
  const { commentPostId } = req.params; //게시글번호
  const nickname = res.locals.user.nickname; //닉네임
  await Comment.create({ commentId, comment, nickname, commentPostId });
  res.json({ result: 'success' });
});

//댓글조회 read
router.get('/comments/:commentPostId', async (req, res) => {
  try {
    const { commentPostId } = req.params;
    const comment = await Comment.find({
      commentPostId: commentPostId,
    }).sort('-commentId');
    res.json({ comment });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//댓글수정 update
router.put('/comments/:commentPostId', AuthMiddleware, async (req, res) => {
  const { commentId } = req.body; //댓글, 댓글 번호
  // const nickname = res.locals.user.nickname; //닉네임
  console.log(commentId);

  const comment = await Article.find({ commentId: commentId });

  if (comment.length) {
    // 있으면 수정하기
    await Article.updateOne({ commentId: commentId }, { $set: { comment } });
  }
  res.json({ success: true, msg: '수정이 완료되었습니다.' });
});

module.exports = router;
