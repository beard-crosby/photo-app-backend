const authHandlers = require('./auth')
const userHandlers = require('./user')

module.exports = {
    ...authHandlers,
    ...userHandlers
}
