const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); //게시물번호 자동생성 패키지

const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
});

UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});

// UserSchema.plugin(AutoIncrement, { inc_field: 'userId' }); //유저 번호 자동생성
module.exports = mongoose.model("User", UserSchema);