const { RateLimiterMemory } = require("rate-limiter-flexible");

const opts = {
    points: 10,
    duration: 1,
    blockDuration: 2,
};

const rateLimiter = new RateLimiterMemory(opts);

const rateLimit = async (req, res, next) => {
    const remoteAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

    rateLimiter
        .consume(remoteAddress, 2)
        .then((rateLimiterRes) => {
            res.set({
                "Retry-After": rateLimiterRes.msBeforeNext / 1000,
                "X-RateLimit-Limit": opts.points,
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
                "X-RateLimit-Limit": opts.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(
                    Date.now() + rateLimiterRes.msBeforeNext
                ),
            });
            return res.status(429).json({
                status: 429,
                message: "Too many requests, please try again later.",
            });
        });
};

module.exports = {
    rateLimit,
};
