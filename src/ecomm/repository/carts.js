const RepositoryClass = require('./repository.class')

class CartsRepo extends RepositoryClass {}

module.exports = new CartsRepo('carts.json')
