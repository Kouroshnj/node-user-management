const multer = require("multer")
const path = require("path")
const { imagesDirectory, uploadImage } = require("../../config/product")
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
    destination: async function (req, file, cb) {
        const userId = req.sessions.userId
        const userImageDirectory = path.resolve(imagesDirectory.directory, userId)
        const isFileExist = checkUserFileExist(userImageDirectory)
        if (!isFileExist) {
            fs.mkdirSync(path.resolve(userImageDirectory))
        }
        cb(null, userImageDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: uploadImage.sizeLimitation },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)/)) {
            file.originalname = undefined
            return cb("", false)
        }
        return cb(undefined, file.originalname)
    }
});


module.exports = upload