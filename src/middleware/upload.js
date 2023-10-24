const multer = require("multer")
const path = require("path")
const factoryErrorInstance = require("../error/factoryError")
const { imagesDirectory, uploadImage } = require(`../../config/${process.env.NODE_ENV}`)
const fs = require("fs")


const checkUserFileExist = (path) => {
    try {
        const doesExist = fs.existsSync(path)
        if (!doesExist) {
            return false
        }
        return true
    } catch (error) {
        throw new Error("this file doesn't exist.")
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const userId = req.sessions.userId
        const size = parseInt(req.headers["content-length"])
        const userImageDirectory = path.resolve(imagesDirectory.directory, userId)
        const isFileExist = checkUserFileExist(userImageDirectory)
        if (!isFileExist) {
            fs.mkdirSync(path.resolve(userImageDirectory))
        }
        if (size > uploadImage.sizeLimitation) {
            return cb(factoryErrorInstance.factory("imageSize", undefined, userId))
        }
        return cb(null, userImageDirectory);
    },
    // filename: function (req, file, cb) {
    //     cb(null, file.originalname);
    // },
});


const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)/)) {
            file.originalname = undefined
            return cb("", false)
        }
        return cb(undefined, file.originalname)
    }
});




module.exports = upload