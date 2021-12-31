const cors = require('cors');

module.exports = (app) => {
    const corsOptions = {
        origin: '*',
        methods: 'OPTIONS,HEAD,GET,POST,PUT,PATCH,DELETE',
    };
    app.use(cors(corsOptions));
};
