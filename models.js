const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/express-auth', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    set(val) {
      // 用bcrypt对密码进行散列
      return require('bcrypt').hashSync(val, 10)
    }
  }
})

const User = mongoose.model('User', UserSchema)
// User.db.dropCollection("users")
module.exports = {
  User
}

