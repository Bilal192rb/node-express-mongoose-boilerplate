const winston = require('winston');
const { server } = require('./env');

const logFormatter = (printf) => printf((info) => `${info.level}: ${info.timestamp} ${info.message}`);

const logger = winston.createLogger({
    level: server.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        server.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        logFormatter(winston.format.printf)
    ),
    transports: [new winston.transports.Console()],
});

module.exports = logger;
