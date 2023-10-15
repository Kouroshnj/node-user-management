const mongoose = require("mongoose")

const loggerSchema = new mongoose.Schema({
    level: {
        type: String
    },
    inputValues: {
        body: {
            type: Object
        },
        params: {
            type: Object
        },
        headers: {
            type: Object
        }
    },
    message: {
        type: String
    },
    userID: {
        type: String
    },
    userIP: {
        type: String
    },
    path: {
        type: String
    },
    loggerType: {
        type: String
    },
    method: {
        type: String
    },
    timestamp: {
        type: Number
    },
})

module.exports = mongoose.model("loggers", loggerSchema)
