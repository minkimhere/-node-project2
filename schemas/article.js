const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); //게시물번호 자동생성 패키지

const articleSchema = new mongoose.Schema({
  //제목
  title: {
    type: String,
    required: true,
  },
  //게시글 내용
  content: {
    type: String,
    required: true,
  },
  //닉네임
  nickname: {
    type: String,
  },
  //날짜
  date: {
    type: String,
  },
});

articleSchema.plugin(AutoIncrement, { inc_field: 'postId' }); //게시물 번호 자동생성

// model의 첫번째 argument가 db이름됨. db이름 될 때 s 자동으로 붙어서 post됨
module.exports = mongoose.model('articles', articleSchema);
