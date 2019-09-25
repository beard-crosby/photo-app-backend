const authHandlers = require('./auth')
const userHandlers = require('./user')
const postHandlers = require('./post')

module.exports = {
    ...authHandlers,
    ...userHandlers,
    ...postHandlers,
}
