const { check } = require('express-validator')
const usersRepo = require('../../repository/users.class')

module.exports = {
  requireEmail: check('email').trim().normalizeEmail().isEmail().custom(async (email) => {
    const existingUser = await usersRepo.getOneBy({email})
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
  }),
  requirePassword: check('password').trim().isLength({min: 4, max: 22}),
  comparePasswords: check('passwordConfirmation').trim().isLength({min: 4, max: 22}).custom(
      (passwordConfirmation, {req}) => {
        if (req.body.password !== passwordConfirmation) {
          throw new Error('The password and the confirm password dont match')
        }
      }
  ),
  requiredEmailExist: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({email})
      if (!user) {
        throw new Error('User with this email does not exist')
      }
    }),
  requiredPasswordValid: check('password')
    .trim()
    .custom(async (password, {req}) => {
      const user = await usersRepo.getOneBy({ email: req.body.email})
      if (!user) {
        throw new Error('User with this email does not exist')
      }

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      )
      if (!validPassword) {
        throw new Error('Password is wrong')
      }
    }),
  requireTitle: check('title')
    .trim()
    .isLength({ min: 3, max: 40})
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({min: 1})
    .withMessage('Must be a number with value more then 1')
}
