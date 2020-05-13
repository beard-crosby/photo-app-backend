const authResolver = require('./authResolver')
const postResolver = require('./postResolver')
const commentResolver = require('./commentResolver')
const miscResolver = require('./miscResolver')

const rootResolver = {
  ...authResolver,
  ...postResolver,
  ...commentResolver,
  ...miscResolver,
}

module.exports = rootResolver