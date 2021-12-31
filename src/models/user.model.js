const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { toJSON, paginate, softDelete } = require('./plugins');
const { roles } = require('../config/userRoles');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email');
                }
            },
        },
        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        educationLevel: {
            type: Number,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Password must contain at least one letter and one number');
                }
            },
            private: true,
        },
        role: {
            type: String,
            enum: roles,
            default: roles[0],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

userSchema
    .virtual('name')
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    })
    .set(function (name) {
        const firstName = name.substring(0, name.indexOf(' '));
        const lastName = name.substring(name.indexOf(' ') + 1);
        this.set({ firstName, lastName });
    });

userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(softDelete);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isContactNumberTaken = async function (contactNumber, excludeUserId) {
    const user = await this.findOne({ contactNumber, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
