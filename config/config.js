require("dotenv").config()

const database = {
    mongoDBUrl: process.env.MONGODB_URL,
    mongoDBDatabaseName: process.env.MONGODB_DATABASE_NAME,
    mongoDBHostName: process.env.MONGODB_HOST_NAME,
    mongoDBPort: process.env.MONGODB_PORT || "27017",
    applicationPort: parseInt(process.env.PORT) || 3000
}

const authenticate = {
    jwtExpiration: parseInt(process.env.EXPIRATION),
    jwtSecretKey: process.env.JWT_SECRET_KEY
}

const imagesDirectory = {
    directory: process.env.IMAGES_FOLDER
}


module.exports = {
    database,
    authenticate,
    imagesDirectory
}