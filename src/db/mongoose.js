const { database } = require("../../config/config")
const mongoose = require("mongoose");


mongoose.connect(`mongodb://${database.mongoDBHostName + ":" + database.mongoDBPort + database.mongoDBDatabaseName}`)