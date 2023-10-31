const CollectionMethodsError = require("./collectionMethods.error");
const DeleteImageError = require("./deleteImage.error");
const DuplicateError = require("./duplicate.error");
const ImageFormatError = require("./imageFormat.error");
const ImageExistence = require("./imageExistence.error")
const SetImageError = require("./setImage.error")
const SchemaValidationError = require("./schemaValidation.error");
const TokenExistenceError = require("./tokenExistence.error");
const InvalidCredentials = require("./userExistence.error");
const ServerError = require("./server.error")
const ImageSize = require("./imageSize.error")

class FactoryError {

    constructor() {
        this.errorTypes = {
            userExistence: InvalidCredentials,
            tokenExistence: TokenExistenceError,
            collectionError: CollectionMethodsError,
            deleteImageError: DeleteImageError,
            duplicateError: DuplicateError,
            imageFormatError: ImageFormatError,
            imageExistence: ImageExistence,
            setImageError: SetImageError,
            schemaValidationError: SchemaValidationError,
            serverError: ServerError,
            imageSizeError: ImageSize
        }
    }

    createError(type, classArgument) {
        const createErrorType = this.errorTypes[type]
        if (createErrorType) {
            return new createErrorType(classArgument)
        }
    }
}

const factoryErrorInstance = new FactoryError

module.exports = factoryErrorInstance