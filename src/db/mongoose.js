const { database } = require(`../../config/${process.env.NODE_ENV}`)
const { getIsoDate } = require("../utils/getDate");
const mongoose = require("mongoose");

const user = database.mongoDBUser ? database.mongoDBUser + ":" : ""
const pwd = database.mongoDBPwd ? database.mongoDBPwd + "@" : ""
const hostName = database.mongoDBHostName ? database.mongoDBHostName + ":" : ""
const dataBasePort = database.mongoDBPort + "/"
const dataBaseName = database.mongoDBDatabaseName

mongoose.connect(
    `mongodb://${user + pwd + hostName + dataBasePort + dataBaseName}`,
    database.options
)

mongoose.connection.on("open", () => {
    console.log(`connected to the database at time: \n ${getIsoDate()}, \n at port: ${process.env.MONGODB_PORT}`)
})

mongoose.connection.on("error", (error) => {
    console.log("Connection error: ", error)
})

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from the database");
})