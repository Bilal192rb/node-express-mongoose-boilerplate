const mongoose = require('mongoose');
const { toJSON, softDelete, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            trim: true,
            uppercase: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);
categorySchema.plugin(softDelete);

categorySchema.statics.isNameTaken = async function (name, excludeUserId) {
    const category = await this.findOne({ name, _id: { $ne: excludeUserId } });
    return !!category;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
