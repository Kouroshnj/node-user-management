const express = require("express");
const userProfileRoutes = require("./userProfileRoutes")
const userAuthRoutes = require("../routes/userAuthRoutes")

const router = express()

router.use(userAuthRoutes)

router.use("/profile", userProfileRoutes)

module.exports = router
