const express = require('express')
const productsRepo = require('../repository/products')
const productsTpl = require('../views/products')

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTpl({products}))
})

module.exports = router
