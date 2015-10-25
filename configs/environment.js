/// <reference path="../typings/node/node.d.ts" />
module.exports = {
    development: {
        db: 'mongodb://localhost/beerlog',
        port: process.env.PORT || 3366
    },
    test: {
        db: 'mongodb://localhost/beerlogtest',
        port: 3667
    },
    production: {
        db: 'mongodb://localhost/beerlog',
        port: process.env.PORT || 80
    }
};
//# sourceMappingURL=environment.js.map