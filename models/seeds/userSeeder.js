
const mongoose = require('mongoose')
const User = require('../User.js')
const users = require('./dummyUsers.js')

mongoose.connect('mongodb://localhost:27017/login-exercise', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongobd error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  users.forEach(user => {
    User.create({
      firstName: user.firstName,
      email: user.email,
      password: user.password
    })
      .catch(error => console.log(error))
  })
  console.log('done!')
})

