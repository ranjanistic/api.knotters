const { REDIS_PASSWORD, REDIS_PORT, REDIS_PREFIX, REDIS_URL } = require("../config");
const Redis = require("ioredis");
const ioredis = new Redis(REDIS_URL, {
    db: 2,
   // port: REDIS_PORT,
  //  password: REDIS_PASSWORD,
    keyPrefix: REDIS_PREFIX,
});

module.exports = ioredis;
