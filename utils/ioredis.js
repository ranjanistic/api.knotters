const { REDIS_PASSWORD, REDIS_PORT, REDIS_PREFIX } = require("../config");
const Redis = require("ioredis");
const ioredis = new Redis({
    db: 2,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    keyPrefix: REDIS_PREFIX,
});

module.exports = ioredis;
