const softDeletePlugin = (schema) => {
    schema.add({
        deletedAt: {
            type: Date,
            default: null,
        },
    });

    schema.methods.delete = async function () {
        this.deletedAt = new Date();
        return this.save();
    };

    const typesFindQueryMiddleware = [
        'count',
        'countDocuments',
        'find',
        'findOne',
        'findOneAndDelete',
        'findOneAndRemove',
        'findOneAndUpdate',
        'update',
        'updateOne',
        'updateMany',
    ];

    const excludeInFindQueriesIsDeleted = async function (next) {
        this.where({ deletedAt: null });
    };

    const excludeInDeletedInAggregateMiddleware = async function (next) {
        this.pipeline().unshift({ $match: { deletedAt: null } });
    };

    schema.pre('remove', async function (doc, next) {
        next();
    });

    typesFindQueryMiddleware.forEach((type) => {
        schema.pre(type, excludeInFindQueriesIsDeleted);
    });

    schema.pre('aggregate', excludeInDeletedInAggregateMiddleware);
};

module.exports = softDeletePlugin;
