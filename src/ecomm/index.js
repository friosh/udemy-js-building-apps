const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: ['dopz982jdawdazcmv83']
}))
app.use(authRouter)


app.listen(3000, () => {
  console.log('Go!');
})
