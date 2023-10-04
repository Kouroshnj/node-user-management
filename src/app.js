const express = require("express")
const { database } = require("../config/config")
require("./db/mongoose")



const PORT = database.applicationPort

const userRouter = require("./routes/userRouter")
const app = express()

app.use(express.json())

app.use(userRouter)


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`app is running on port ${PORT}`);
})