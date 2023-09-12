const mongoose = require("mongoose");
require("dotenv").config()

// Connect to the MongoDB database
mongoose.connect(process.env.SECRET_URL)


