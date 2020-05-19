const express = require('express')
const productsRepo = require('../../repository/products.class')
const productsTpl = require('../../views/admin/products')
const productNewTpl = require('../../views/admin/products/new')
const productEditTpl = require('../../views/admin/products/edit')
const { requirePrice, requireTitle } = require('./validators')
const multer = require('multer')
const { handleErrors, requireAuth } = require('./middlewares')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTpl({ products }) )
})

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productNewTpl({}))
})

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productNewTpl),
  async (req, res) => {
    const image = req.file.buffer.toString('base64')
    const {title, price} = req.body
    await productsRepo.create({title, price, image})

    res.redirect('/admin/products')
  }
)

router.get('/admin/products/:id/edit', async (req, res) => {
  const product = await productsRepo.getOne(req.params.id)

  if (!product) {
    return res.send('Product not found')
  }

  res.send(productEditTpl({ product }))
})

router.post('/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productEditTpl, async (req) => {
    const product = await productsRepo.getOne(req.param.id)
    return { product }
  }),
  async (req, res) => {
    const changes = req.body
    if (req.file) {
      changes.image = req.file.image.toString('base64')
    }
    try {
      await productsRepo.update(req.params.id, changes)
    } catch (e) {
      return res.send('Could not find item')
    }
    res.redirect('/admin/products')
})

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id)
  res.redirect('/admin/products/')
})

module.exports = router
