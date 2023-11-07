const mongoose = require("mongoose")

const loggerSchema = new mongoose.Schema({
    level: String,

    inputValues: {
        body: Object,

        params: Object,

        headers: Object
    },

    message: String,

    userID: String,

    userIP: String,

    path: String,

    loggerType: String,

    codes: {
        statusCode: Number,
        errorCode: String
    },
    method: String,

    timestamp: Number
})

module.exports = mongoose.model("loggers", loggerSchema)
