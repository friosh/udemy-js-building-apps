const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const RepositoryClass = require('./repository')

const scrypt = util.promisify(crypto.scrypt)

class Users extends RepositoryClass {
  async create(attrs) {
    attrs.id = this.randomId()

    const salt = crypto.randomBytes(8).toString('hex')
    const buf = await scrypt(attrs.password, salt, 64)

    const records = await this.getAll()
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    }
    records.push(record)
    await this.writeAll(records)
    return record
  }

  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split('.')
    const hashSuppliedBuf = await scrypt(supplied, salt, 64)
    return hashed === hashSuppliedBuf.toString('hex')
  }
}

module.exports = new Users('users.json')
