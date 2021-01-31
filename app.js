const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')

const User = require('./models/User.js')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/login-exercise', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongobd error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'oeni93u4bcfmjex,a',
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login/test', (req, res) => {
  const email = req.session.email
  return User.find({ email })
    .lean()
    .then(user => {
      if (!user.length) { res.render('fail') }
      res.render('test', { user: user[0] })
    })
    .catch(error => console.log(error))
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  return User.find({ email })
    .lean()
    .then(user => {
      if (user[0].password === password) {
        req.session.email = email
        const firstName = user[0].firstName
        res.render('welcome', { firstName })
      } else {
        res.render('fail')
      }
      return
    })
    .catch(error => {
      res.render('fail')
      console.log(error)
      return
    })
})

app.listen(port, () => {
  console.log(`express is listening on http://localhost:${port}`)
})