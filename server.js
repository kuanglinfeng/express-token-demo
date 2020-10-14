const express = require('express')
const jwt = require("jsonwebtoken")
const { User } = require('./models')

const app = express()
const SECRET = 'sdiofjsfnwrjewoma'

app.use(express.json())


app.get('/api/users', async (request, response) => {
  const users = await User.find()
  response.send(users)
})


app.post('/api/register', async (request, response) => {
  const user = await User.create({
    username: request.body.username,
    password: request.body.password
  })
  response.send(user)
})

app.post('/api/login', async (request, response) => {
  const user = await User.findOne({
    username: request.body.username
  })
  if (!user) {
    return response.status(422).send({
      message: '用户不存在'
    })
  }
  const isPasswordValid = require('bcrypt').compareSync(
    request.body.password,
    user.password
  )
  if (!isPasswordValid) {
    return response.status(422).send({
      message: '密码错误'
    })
  }
  // 用用户的id + 秘钥 => 生成token
  const token = jwt.sign({
    // 一般用用户的唯一字段 除了密码
    id: String(user._id)
  }, SECRET)
  response.send({
    user,
    token
  })
})

// 自定义授权中间件
const auth = async (request, response, next) => {
  const token = String(request.headers.authorization).split(' ').pop()
  try {
    // 用token和秘钥进行解密 得到用户的id
    const decoded = jwt.verify(token, SECRET);
    const { id } = decoded
    request.user = await User.findById(id)
  } catch(err) {
    request.user = null
  }
  next()
}


app.get('/api/profile', auth, async (request, response) => {
  if (request.user) {
    response.send(request.user)
  } else {
    response.send('用户未登录')
  }
})


app.listen(5001, () => {
  console.log("http://localhost:5001")
})