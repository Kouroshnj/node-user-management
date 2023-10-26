require("dotenv").config()
require("./db/mongoose")
const helmet = require("helmet")
const express = require("express")
const cors = require("cors")
const { database } = require(`../config/${process.env.NODE_ENV}`)
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware")
const sendOKMiddleware = require("./middleware/sendOKMiddleware")

const routeAggregator = require("./routes/routeAggregator")


const PORT = database.applicationPort

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use(sendOKMiddleware)

app.use("/users/api/v1/", routeAggregator)

app.use(errorHandlingMiddleware)

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`app is running on port ${PORT}`);
})