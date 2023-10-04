const multer = require("multer")
const path = require("path")
const { imagesDirectory } = require("../../config/config")
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
        const isFileExist = await checkUserFileExist(userImageDirectory)
        if (!isFileExist) {
            fs.mkdirSync(path.resolve(userImageDirectory))
        }
        cb(null, userImageDirectory);
    },
    filename: function (req, file, cb) {
        // Use the original name of the file
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: 2000000,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)/)) {
            return cb(new Error("format must be jpg or png"))
        }
        return cb(undefined, file.originalname)
    }
});


module.exports = upload