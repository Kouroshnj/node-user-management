const multer = require("multer")
const path = require("path")
const factoryErrorInstance = require("../error/factory.error")
const { imagesDirectory, uploadImage } = require(`../../config/${process.env.NODE_ENV}`)
const fs = require("fs")


const checkUserFileExist = async (path) => {
    try {
        const doesExist = fs.existsSync(path)
        if (!doesExist) {
            return false
        }
        return true
    } catch (error) {
        console.log(error);
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const userId = req.sessions.userId
            const size = parseInt(req.headers["content-length"])
            const userImageDirectory = path.resolve(imagesDirectory.directory, userId)
            const isFileExist = await checkUserFileExist(userImageDirectory)
            if (!isFileExist) {
                fs.mkdirSync(path.resolve(userImageDirectory))
            }
            if (size > uploadImage.limitation.imageSize) {
                return cb(factoryErrorInstance.createError("imageSizeError", userId))
            }
            return cb(null, userImageDirectory);
        } catch (error) {
            return cb(factoryErrorInstance.create("setImageError"))
        }
    },
    filename: async (req, file, cb) => {
        cb(null, file.originalname);
    },

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