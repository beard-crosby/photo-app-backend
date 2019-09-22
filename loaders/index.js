const expressLoader = require('./express')
// const mongooseLoader = require('./mongoose')
// const Logger = require('./logger')

module.exports.default = async (app) => {
    // await mongooseLoader()
    // Logger.info('DB Connected')

    await expressLoader(app)
    // Logger.info('Express Running')
}
