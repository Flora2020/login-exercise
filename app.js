const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  return User.find({ email: email })
    .lean()
    .then(user => {
      if (user[0].password === password) {
        const firstName = user[0].firstName
        res.render('welcome', { firstName })
      } else {
        res.redirect('/')
      }
      return
    })
    .catch(error => {
      res.redirect('/')
      console.log(error)
      return
    })
})

app.listen(port, () => {
  console.log(`express is listening on http://localhost:${port}`)
})