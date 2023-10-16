const { database } = require(`../../config/${process.env.NODE_ENV}`)
const mongoose = require("mongoose");


mongoose.connect(`mongodb://${database.mongoDBHostName + ":" + database.mongoDBPort + "/" + database.mongoDBDatabaseName}`)