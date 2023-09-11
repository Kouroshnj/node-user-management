const multer = require("multer")



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where the file will be saved
        cb(null, 'avatars/');
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