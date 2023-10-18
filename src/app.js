require("dotenv").config()
// const setRateLimit = require("express-rate-limit")
const express = require("express")
const { database } = require(`../config/${process.env.NODE_ENV}`)
const cors = require("cors")
const { errorHandlingMiddleware } = require("./middleware/errorHandlingMiddleware")
const sendOKMiddleware = require("./middleware/sendOKMiddleware")
const setLimitter = require("./middleware/rateLimit")
require("./db/mongoose")
const userAuthRoutes = require("./routes/userAuthRoutes")
const userProfileRoutes = require("./routes/userProfileRoutes")


const PORT = database.applicationPort

const app = express()

app.use(express.json())
app.use(cors())

// app.use(setLimitter)


app.use(sendOKMiddleware)

app.use("/users/api/v1", userAuthRoutes)
app.use("/users/api/v1/profile", userProfileRoutes)

app.use(errorHandlingMiddleware)

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`app is running on port ${PORT}`);
})