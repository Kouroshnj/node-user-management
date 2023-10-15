const { database } = require("../../config/product")
const mongoose = require("mongoose");


mongoose.connect(`mongodb://${database.mongoDBHostName + ":" + database.mongoDBPort + "/" + database.mongoDBDatabaseName}`)