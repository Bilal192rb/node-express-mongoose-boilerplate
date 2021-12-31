const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const httpStatus = require('http-status');
const { jwt } = require('./env');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');

const jwtOptions = {
    secretOrKey: jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (!payload.type || payload.type !== 'ACCESS') {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
        }
        const user = await userService.getUserById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
