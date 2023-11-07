const requestDetails = (request) => {
    const inputValues = {
        body: request.body,
        params: request.params,
        headers: request.headers
    }

    return inputValues
}


module.exports = requestDetails