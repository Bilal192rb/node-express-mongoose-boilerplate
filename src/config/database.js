const mongoose = require('mongoose');
const util = require('util');
const { database } = require('./env');
const logger = require('./logger');

const connect = async () => {
    const databaseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    };
    mongoose.connect(database.url, databaseOptions).then(
        (connection) => {
            logger.info('Database connected');
        },
        (error) => {
            logger.error(error);
            throw new Error(`Database connection error: ${error.message}`);
        }
    );
    mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
        const msgMapper = (msg) => {
            return util
                .inspect(msg, false, 10, true)
                .replace(/\n/g, '')
                .replace(/\s{2,}/g, ' ');
        };
        logger.debug(`Mongoose: ${collectionName}.${methodName}` + `(${methodArgs.map(msgMapper).join(', ')})`);
    });
};

module.exports = { connect };
