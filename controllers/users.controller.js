const bcrypt = require('bcrypt')
const User = require('../models/User.model')

module.exports.UserController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body
      const userNameCheck = await User.findOne({ username })
      if (userNameCheck) {
        return res.json({ message: 'Данный логин уже занят', status: false })
      }

      const emailCheck = await User.findOne({ email })

      if (emailCheck) {
        return res.json({
          message: 'Данный email уже используется',
          status: false,
        })
      }

      const { BCRYPT_ROUNDS } = process.env

      const hash = await bcrypt.hash(password, Number(BCRYPT_ROUNDS))
      const user = await User.create({
        username,
        email,
        password: hash,
      })
      delete user.password
      return res.json({ status: true, user })
    } catch (error) {
      return res.json(error)
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await User.findOne({ username })

      if (!user) {
        return res.json({
          message: 'Неправильный логин или пароль',
          status: false,
        })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.json({
          message: 'Неправильный логин или пароль',
          status: false,
        })
      }

      delete user.password
      return res.json({ status: true, user })
    } catch (err) {
      return res.json({ error: err })
    }
  },

  setAvatar: async (req, res) => {
    try {
      const userId = req.params.id
      const avatarImage = req.body.image
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },

        { new: true } // возвращает при update измененный документ сразу, если его не использовать возвращается старая версия документа.
      )

      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      })
    } catch (err) {
      return res.json({ error: err })
    }
  },

  allUsers: async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        // $ne  - означает не равно, Пример Обратная операция - найдем пользователей, возраст которых НЕ равен 22: db.users.find ({age: {$ne : 22}})
        // select()— это метод Mongoose, который используется для выбора полей документа, которые должны быть возвращены в результате запроса. Он используется для включения или исключения полей документа, возвращаемых запросом Mongoose. Метод select()выполняет то, что называется проекцией запроса. В нашем случае возвращаются следующие поля документов, оставляя поля password и isAvatarImageSet
        
        'email',
        'username',
        'avatarImage',
        '_id',
      ])
      return res.json(users)
    } catch (err) {
      return res.json({ error: err })
    }
  },
}
