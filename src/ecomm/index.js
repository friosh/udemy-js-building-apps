const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="post">
        <input name="email" type="text" placeholder="email">
        <input name="password" type="password" placeholder="password">
        <input name="password-confirmation" type="password" placeholder="password confirmation">
        <button>Sign up</button>
      </form>
    </div>
  `)
})

app.post('/', (req, res) => {
  res.send(req.body)
})

app.listen(3000, () => {
  console.log('Go!');
})
