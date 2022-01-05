const server = require("./app"),
    { V1, INTERNAL } = require("./utils/paths"),
    { HOST, PORT, CERT_KEY, CERT_FILE, INTERNAL_KEY } = require("./config"),
    { redisConnect } = require("./utils/redis"),
    { setAuthLabel } = require("./middleware/authorize"),
    { rateLimit } = require("./middleware/ratelimit"),
    { attach } = require("./db"),
    https = require("https"),
    http = require("http"),
    fs = require("fs");

attach((err, db) => {
    if (err) throw Error(err);
    const endpoints = () => {
        console.log("DB:", db.namespace);
        server.use((req, _, next) => {
            req["db"] = db;
            next();
        }, setAuthLabel, rateLimit);
        server.use(
            V1.ROOT,
            require("./v1")
        );
        server.use(
            INTERNAL.ROOT,
            (req, res, next) => {
                if (req.params.pathkey != INTERNAL_KEY) {
                    return res.status(404).json({
                        comments: [
                            "Not found",
                            "Check the path and try again.",
                            "For example, try using /v1 GET path.",
                        ],
                    });
                }
                next();
            },
            require("./internal")
        );
        server.use((_, res) => {
            res.status(404).json({
                comments: [
                    "Not found",
                    "Check the path and try again.",
                    "For example, try using /v1 GET path.",
                ],
            });
        });
    };

    try {
        const cert = fs.readFileSync(CERT_FILE);
        const key = fs.readFileSync(CERT_KEY);
        https.createServer({ key, cert }, server).listen(PORT, HOST, () => {
            console.log("Started (https): ", HOST, PORT);
            redisConnect(endpoints);
        });
    } catch (e) {
        http.createServer(server).listen(PORT, HOST, async () => {
            console.log("Started (http): ", HOST, PORT);
            redisConnect(endpoints);
        });
    }
});
