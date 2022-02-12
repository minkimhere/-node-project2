const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../schemas/user');
const authMiddleware = require('../middlewares/authMiddleware');

// const postUsersSchema = Joi.object({
//     nickname: Joi.string().required(),
//     nickname: Joi.string().nickname().required(),
//     password: Joi.string().required(),
//     confirmPassword: Joi.string().required(),
// });

const postUsersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().required(),
});

router.post('/user', async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '비밀번호가 비밀번호 확인란과 동일하지 않습니다.',
      });
      return;
    }

    if (password.indexOf(nickname) > -1) {
      // password 안에 nickname의 value가 있나 검사해서 index가 0이상이 나온다면, password안에 nickname이 있는 것이다.
      console.log(password.indexOf(nickname));
      res.status(400).send({
        errorMessage: '비밀번호에 닉네임을 포함시킬 수 없습니다.',
      });
      return;
    }

    const existUsers = await User.find({
      $or: [{ nickname }],
    });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 가입된 닉네임이 있습니다.',
      });
      return;
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

const postAuthSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});
router.post('/auth', async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ nickname, password }).exec();

    if (!user) {
      res.status(400).send({
        errorMessage: '닉네임 또는 패스워드가 잘못됐습니다.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'mein-secret-key');
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

router.get('/user/me', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;
