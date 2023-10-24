const CollectionMethodsError = require("./collectionMethods.error");
const DeleteImageError = require("./deleteImage.error");
const DuplicateError = require("./duplicate.error");
const ImageFormatError = require("./imageFormat.error");
const ImageUploadSizeError = require("./imageUploadSize.error");
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
        if (type === "imageUploadSize") {
            throw new ImageUploadSizeError
        }
        if (type === "imageFormat") {
            throw new ImageFormatError
        }
        if (type === "imageSize") {
            return new ImageSize(userId)
        }
        if (type === "collection") {
            throw new CollectionMethodsError
        }
        if (type === "deleteImage") {
            throw new DeleteImageError
        }
    }
}

const factoryErrorInstance = new FactoryError

module.exports = factoryErrorInstance