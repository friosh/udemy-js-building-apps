const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const usersRepo = require('./repository/users')


app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
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

app.post('/', async (req, res) => {
  const {email, password, passwordConfirmation} = req.body
  const existingUser = await usersRepo.getOneBy({email})
  if (existingUser) {
    return res.send('User with this email already exists')
  }
  if (password !== passwordConfirmation) {
    return res.send('The password and the confirm password dont match')
  }
  await usersRepo.create({email, password})
  res.send('New user created')
})

app.listen(3000, () => {
  console.log('Go!');
})
