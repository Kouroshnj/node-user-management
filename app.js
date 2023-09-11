const express = require("express")
require("./src/db/mongoose")


const userRouter = require("./routes/userRouter")
const app = express()

app.use(express.json())

app.use(userRouter)

app.listen(3000, () => {
    console.log("Server is up on port 3000");
})