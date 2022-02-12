const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); //게시물번호 자동생성 패키지

const CommentSchema = new mongoose.Schema({
  //닉네임
  nickname: {
    type: String,
  },
  //게시글 내용
  comment: {
    type: String,
  },
  // 게시글번호 
  commentPostId: {
    type: String,
  },
});

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' }); //댓글 번호 자동생성

// model의 첫번째 argument가 db이름됨. db이름 될 때 s 자동으로 붙어서 post됨
module.exports = mongoose.model('Comment', CommentSchema);
