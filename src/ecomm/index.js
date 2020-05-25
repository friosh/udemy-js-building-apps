const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const adminProductRouter = require('./routes/admin/products')
const productRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: ['dopz982jdawdazcmv83']
}))

app.use(authRouter)
app.use(adminProductRouter)
app.use(productRouter)
app.use(cartsRouter)


app.listen(3000, () => {
  console.log('Go!');
})
