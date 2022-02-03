const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
const AuthMiddleware = require("../middlewares/authMiddleware");

//댓글쓰기 create 
router.post("/comment/:commentPostId", AuthMiddleware, async (req, res) => {
    const { comment, commentId } = req.body; //댓글, 댓글 번호
    const { commentPostId } = req.params; //게시글번호
    const nickname = res.locals.user.nickname; //닉네임
    await Comment.create({ commentId, comment, nickname, commentPostId});
    res.json({ result: 'success' });
});

//댓글조회 read
router.get("/comments/:postId", async (req, res) => {
    try {
        const {postId} = req.params;
        const comment = await Comment.find().sort("-commentId");
        res.json({ comment});
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});






module.exports = router;