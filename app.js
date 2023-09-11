const express = require("express")
require("./src/db/mongoose")

const PORT = process.env.PORT || 3000

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