const mongoose = require('mongoose');
const { toJSON, paginate, softDelete } = require('./plugins');

const authTokenSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

authTokenSchema.plugin(toJSON);
authTokenSchema.plugin(paginate);
authTokenSchema.plugin(softDelete);

const AuthToken = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthToken;
