class BaseService {

    constructor(model) {
        this.model = model
    }

    async createDocument(object) {
        const document = new this.model(object)
        return document.save()
    }

    async updateOne(query, operation) {
        return this.model.updateOne(query, operation)
    }

    async findOneAndUpdate(query, operation) {
        return this.model.findOneAndUpdate(query, operation)
    }

    async findOne(query, select) {
        return this.model.findOne(query).select(select).lean()
    }

    async deleteOne(query) {
        return this.model.deleteOne(query)
    }

    async deleteMany(query) {
        return this.model.deleteMany(query)
    }

    async findOneAndDelete(query, operation) {
        return this.model.findOneAndDelete(query, operation)
    }

    async aggregate(pipeline) {
        return this.model.aggregate(pipeline)
    }
}

module.exports = BaseService