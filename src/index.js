const http = require('http');
const app = require('./app');
const { server: serverEnv } = require('./config/env');
const logger = require('./config/logger');

const { port, env } = serverEnv;

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`${env} server listening on ${bind}`);
});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            unexpectedErrorHandler(`${bind} requires elevated privileges`);
            break;
        case 'EADDRINUSE':
            unexpectedErrorHandler(`${bind} is already in use`);
            break;
        default:
            throw error;
    }
});

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
