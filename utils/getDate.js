const getUnixTimestamp = () => {
    return Math.round(Date.now() / 1000)
}

const getIsoDate = () => {
    return new Date()
}

module.exports = {
    getIsoDate,
    getUnixTimestamp
}