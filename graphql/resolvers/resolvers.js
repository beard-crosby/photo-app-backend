const authResolver = require('./authResolver')
const postResolver = require('./postResolver')
const commentResolver = require('./commentResolver')

const rootResolver = {
  ...authResolver,
  ...postResolver,
  ...commentResolver
}

module.exports = rootResolver