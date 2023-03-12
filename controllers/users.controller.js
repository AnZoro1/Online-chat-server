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
  },
}
