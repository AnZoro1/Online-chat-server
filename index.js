const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const socket = require('socket.io')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use(require('./routes/users.route'))

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log('База подклбчена')
  })
  .catch((e) => {
    console.log(e.toString())
  })

const server = app.listen(PORT, (err) => {
  if (err) {
    return console.log(err.toString())
  }
  console.log(`Сервер запущен на порту ${PORT}`)
})
