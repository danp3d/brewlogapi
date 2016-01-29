module.exports = {
    development: {
        db: 'mongodb://localhost/beerlog',
        port: process.env.PORT || 3366
    },
    test: {
        db: 'mongodb://127.0.0.1/beerlogtest',
        port: 3667
    },
    production: {
        db: 'mongodb://localhost/beerlog',
        port: process.env.PORT || 80
    }
};
