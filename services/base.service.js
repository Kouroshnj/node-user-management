
class BaseMethods {

    constructor(model) {
        this.model = model
    }

    async updateOne(query, operation) {
        return await this.model.updateOne(query, operation)
    }

    async findOne(query, select) {
        return await this.model.findOne(query).select(select)
    }

    async deleteOne(query) {
        return await this.model.deleteOne(query)
    }

    async findOneAndUpdate(query, operation) {
        return this.model.findOneAndUpdate(query, operation)
    }
}

module.exports = BaseMethods