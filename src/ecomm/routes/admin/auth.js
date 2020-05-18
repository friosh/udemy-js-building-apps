const express = require('express')
const usersRepo = require('../../repository/users')
const router = express.Router()
const signupTpl = require('../../views/admin/auth/signup')
const signinTpl = require('../../views/admin/auth/signin')
const { validationResult } = require('express-validator')
const {
  requireEmail,
  requirePassword,
  comparePasswords,
  requiredEmailExist,
  requiredPasswordValid
} = require('./validators')

router.get('/signup', (req, res) => {
  res.send(signupTpl())
})

router.post(
  '/signup',
  [requireEmail, requirePassword, comparePasswords],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send(signupTpl({ errors }))
    }
    const {email, password, passwordConfirmation} = req.body
    const user = await usersRepo.create({email, password})
    req.session.userId = user.id
    res.send('New user created')
})

router.get('/signout', (req, res) => {
  req.session = null
  res.send("You're logged out")
})

router.get('/signin', (req, res) => {
  res.send(signinTpl({}))
})

router.post('/signin',
  [requiredEmailExist, requiredPasswordValid],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send(signinTpl({ errors }))
    }

    const {email} = req.body
    const user = await usersRepo.getOneBy({email})

    req.session.userId = user.id
    res.send('Hello, user')
})

module.exports = router
