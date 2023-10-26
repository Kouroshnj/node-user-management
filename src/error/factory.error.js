const CollectionMethodsError = require("./collectionMethods.error");
const DeleteImageError = require("./deleteImage.error");
const DuplicateError = require("./duplicate.error");
const ImageFormatError = require("./imageFormat.error");
const ImageExistence = require("./imageExistence.error")
const SetImageError = require("./setImage.error")
const SchemaValidationError = require("./schemaValidation.error");
const TokenExistenceError = require("./tokenExistence.error");
const InvalidCredentials = require("./userExistence.error");
const ImageSize = require("./imageSize.error")

class FactoryError {
    factory(type, message, userId) {
        if (type === "userExistence") {
            throw new InvalidCredentials
        }
        if (type === "tokenExistence") {
            throw new TokenExistenceError
        }
        if (type === "duplicate") {
            return new DuplicateError(message)
        }
        if (type === "schemaValidation") {
            throw new SchemaValidationError
        }
        if (type === "imageFormat") {
            throw new ImageFormatError
        }
        if (type === "imageExistence") {
            throw new ImageExistence
        }
        if (type === "imageSize") {
            return new ImageSize(userId)
        }
        if (type === "collectionMethod") {
            throw new CollectionMethodsError
        }
        if (type === "deleteImage") {
            throw new DeleteImageError
        }
        if (type === "setImage") {
            return new SetImageError
        }
    }
}

const factoryErrorInstance = new FactoryError

module.exports = factoryErrorInstance