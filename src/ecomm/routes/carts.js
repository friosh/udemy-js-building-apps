const express = require('express')
const cartsRepo = require('../repository/carts')
const productRepo = require('../repository/products.class')
const cartTpl = require('../views/carts/show')

const router = express.Router()

router.post('/cart/products', async(req, res) => {
  let cart
  if (!req.session.cartId) {
    cart = await cartsRepo.create({items: []})
    req.session.cartId = cart.id
  } else {
    console.log(req.session.cartId);
    cart = await cartsRepo.getOne(req.session.cartId)
  }

  const existingItem = cart.items.find(item => item.id === req.body.productId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.items.push({id: req.body.productId, quantity: 1})
  }

  await cartsRepo.update(cart.id, {items: cart.items})
  res.redirect('/')
})

router.get('/cart', async(req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/')
  }

  const cart = await cartsRepo.getOne(req.session.cartId)
  for(let item of cart.items) {
    const product = await productRepo.getOne(item.id)
    item.product = product
  }
  res.send(cartTpl({items: cart.items }))
})

router.post('/cart/products/delete', async (req, res) => {
  const {itemId} = req.body
  const cart = await cartsRepo.getOne(req.session.cartId)

  const items = cart.items.filter(item => item.id !== itemId)
  await cartsRepo.update(req.session.cartId, { items })
  res.writeHead(301,
      {Location: '/cart'}
  );
  res.end();
})

module.exports = router
