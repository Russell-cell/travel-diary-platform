const express = require('express');
var UsersRouter = express.Router();
const { User } = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const app = express();
const SECRET = 'wufan';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userController = require('../controllers/UserController')

// 获取用户信息
UsersRouter.get('/', (req, res) => {
  console.log('req对象',res.query)
})

UsersRouter.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  }, { username: 1, password: 1, avatar: 1, nickname: 1 })
  
  if (!user) {
    return res.send({
      message: "用户名不存在"
    })
  } else {
    bcrypt.compare(
      req.body.password,
      user.password,
      (err, isValid) => {
        if (!!isValid) {
          const token = jwt.sign({
            id: String(user._id),
          }, SECRET, { expiresIn: "7d" }) // 设置token失效时间为7天
          res.header("Authorization", token)  // token放在请求头中
          res.send({
            message: "登录成功",
            user,  
          })
        } else {
          res.send({
            message: "密码错误"
          })
        }
      }
    );
  }
})

// 用于验证token的中间件
const auth = async (req, res, next) => {
  try {
    console.log(req.headers.token)
    console.log("UsersRouter验证token:", req.headers.token ? "存在" : "不存在");
    const { id } = jwt.verify(req.headers.token, SECRET);  // 这个操作需要时间
    req.user = await User.findById(id, { username: 1, avatar: 1, nickname: 1 });
    next();
  } catch (e) {
    console.error("UsersRouter token验证失败:", e.message);
    return res.status(401).send({ message: "token过期了~" });
  }
}

UsersRouter.get('/getUserInfo', auth, async (req, res) => {
  if (!!req.user) {
    const userInfo = await User.findById(req.user._id, '_id username nickname avatar collectTravels likeTravels gender introduction').exec()
    res.send(userInfo);
  } else {
    res.send({ message: 'token无效' })
  }
})

UsersRouter.post('/upload/avatar', userController.upload)

UsersRouter.post('/update', userController.update)

UsersRouter.post('/register', userController.register)

module.exports = UsersRouter
