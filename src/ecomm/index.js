const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const usersRepo = require('./repository/users')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: ['dopz982jdawdazcmv83']
}))

app.get('/signup', (req, res) => {
  res.send(`
    <div>
      <form method="post">
        <input name="email" type="text" placeholder="email">
        <input name="password" type="password" placeholder="password">
        <input name="passwordConfirmation" type="password" placeholder="password confirmation">
        <button>Sign up</button>
      </form>
    </div>
  `)
})

app.post('/signup', async (req, res) => {
  const {email, password, passwordConfirmation} = req.body
  const existingUser = await usersRepo.getOneBy({email})
  if (existingUser) {
    return res.send('User with this email already exists')
  }
  if (password !== passwordConfirmation) {
    return res.send('The password and the confirm password dont match')
  }
  const user = await usersRepo.create({email, password})
  req.session.userId = user.id
  res.send('New user created')
})

app.get('/signout', (req, res) => {
  req.session = null
  res.send("You're logged out")
})

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="post">
        <input name="email" type="text" placeholder="email">
        <input name="password" type="password" placeholder="password">
        <button>Sign in</button>
      </form>
    </div>
  `)
})

app.post('/signin', async (req, res) => {
  const {email, password} = req.body
  const user = await usersRepo.getOneBy({email})
  if (!user) {
    return res.send('User with this email does not exist')
  }
  const validPassword = await usersRepo.comparePasswords(user.password, password)
  if (!validPassword) {
    return res.send('Password is wrong')
  }
  req.session.userId = user.id
  res.send('Hello, user')
})

app.listen(3000, () => {
  console.log('Go!');
})
