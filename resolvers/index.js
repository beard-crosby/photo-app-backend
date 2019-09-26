const authHandlers = require('./auth')
const userHandlers = require('./user')
const postHandlers = require('./post')
const commentHandlers = require('./comment')

module.exports = {
    ...authHandlers,
    ...userHandlers,
    ...postHandlers,
    ...commentHandlers,
}
