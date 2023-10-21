const { database } = require(`../../config/${process.env.NODE_ENV}`)
const mongoose = require("mongoose");
const { getIsoDate } = require("../utils/getDate");


mongoose.connect(
    `mongodb://${database.mongoDBHostName + ":" + database.mongoDBPort + "/" + database.mongoDBDatabaseName}`
)

mongoose.connection.on("open", () => {
    console.log(`connected to the database at time: \n ${getIsoDate()}, \n at port: ${process.env.PORT}`)
})

mongoose.connection.on("error", (error) => {
    console.log("Connection error: ", error)
})

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from the database");
})