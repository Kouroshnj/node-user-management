require("dotenv").config()
const express = require("express")
const { database } = require(`../config/${process.env.NODE_ENV}`)
const { statusCodes, errorCodes } = require("./constant/consts")
const cors = require("cors")
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware")
const generateMetaInformation = require("./constant/meta")
require("./db/mongoose")
const { sendOKLogDisplay } = require("./utils/sendOKUtils")
const userAuthRoutes = require("./routes/userAuthRoutes")
const userProfileRoutes = require("./routes/userProfileRoutes")


const PORT = database.applicationPort

const app = express()

app.use(express.json())
app.use(cors())

app.response.sendOK = async function (options) {
    const returnValue = await sendOKLogDisplay(options)
    return this.status(statusCodes.OK).send({ data: returnValue, meta: generateMetaInformation(errorCodes.OK) })
}

app.use("/users/api/v1", userAuthRoutes)
app.use("/users/api/v1/profile", userProfileRoutes)

app.use(errorHandlingMiddleware)

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`app is running on port ${PORT}`);
})