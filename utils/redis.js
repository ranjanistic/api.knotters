const { REDIS_PASSWORD, REDIS_URL, REDIS_PREFIX } = require("../config");
const redis = require("redis");

const client = redis.createClient({
    password:
    url: REDIS_URL,
    database: 2,
});

module.exports = {
    redisConnect: async (callback = (_) => {}) => {
        try {
            await client.connect();
            console.log("Redis connected");
            callback();
        } catch (e) {
            console.log("Redis connection error");
            console.log(e);
        }
    },
    setCache: async (key, value, time) => {
        try {
            return await client.setEx(`${REDIS_PREFIX}${key}`, time, value);
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    getCache: async (key) => {
        try {
            return await client.get(`${REDIS_PREFIX}${key}`);
        } catch {
            return null;
        }
    },
    remCache: async (key) => {
        try {
            return await client.del(`${REDIS_PREFIX}${key}`);
        } catch {
            return null;
        }
    },
    redisDisconnect: async () => {
        try {
            await client.disconnect();
            console.log("Redis disconnected");
        } catch (e) {
            console.log("Redis disconnection error");
            console.log(e);
        }
    },
    redisClient: client,
};
