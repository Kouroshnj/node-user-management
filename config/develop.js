require("dotenv").config()

const database = {
    mongoDBUrl: process.env.MONGODB_URL,
    mongoDBDatabaseName: process.env.MONGODB_DATABASE_NAME,
    mongoDBHostName: process.env.MONGODB_HOST_NAME,
    mongoDBPort: process.env.MONGODB_PORT || "27017",
}

const tokenDetails = {
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION),
    jwtSecretKey: process.env.JWT_SECRET_KEY
}

const imagesDirectory = {
    directory: process.env.IMAGES_FOLDER
}

const uploadImage = {
    limitation: {
        imageSize: parseInt(process.env.IMAGE_UPLOAD_SIZE_LIMIT)
    }
}

const loggerConfig = {
    showLogInTerminal: true,
    storeLogInMongo: true
}

const applicationComponents = {
    applicationPort: parseInt(process.env.PORT) || 3000
}




module.exports = {
    database,
    tokenDetails,
    imagesDirectory,
    uploadImage,
    loggerConfig,
    applicationComponents
}