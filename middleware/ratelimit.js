const ioredis = require("../utils/ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const generalRatelimiter = new RateLimiterRedis({
    storeClient: ioredis,
    points: 10,
    duration: 1,
    blockDuration: 4,
});
const authRatelimiter = new RateLimiterRedis({
    storeClient: ioredis,
    points: 16,
    duration: 1,
    blockDuration: 2,
});
const internalRatelimiter = new RateLimiterRedis({
    storeClient: ioredis,
    points: 22,
    duration: 1,
    blockDuration: 1,
});

const rateLimit = async (req, res, next) => {
    const remoteAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

    const limiter =
        req["is_authorized"] && req["is_internal"]
            ? internalRatelimiter
            : req["is_authorized"]
            ? authRatelimiter
            : generalRatelimiter;
    limiter
        .consume(remoteAddress, 2)
        .then((rateLimiterRes) => {
            res.set({
                "Retry-After": rateLimiterRes.msBeforeNext / 1000,
                "X-RateLimit-Limit": limiter.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(
                    Date.now() + rateLimiterRes.msBeforeNext
                ),
            });
            next();
        })
        .catch((rateLimiterRes) => {
            res.set({
                "Retry-After": rateLimiterRes.msBeforeNext / 1000,
                "X-RateLimit-Limit": limiter.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(
                    Date.now() + rateLimiterRes.msBeforeNext
                ),
            });
            return res.status(429).json({
                status: 429,
                message: `Too many requests, please try again in ${limiter.blockDuration}s.`,
            });
        });
};

module.exports = {
    rateLimit,
};
