const server = require("express")(),
    { HOST, PORT, CERT_KEY, CERT_FILE } = require("./config"),
    { attach } = require("./db"),
    https = require("https"),
    http = require("http"),
    fs = require("fs");

attach((err, db) => {
    if (err) throw Error(err);
    try {
        const cert = fs.readFileSync(CERT_FILE);
        const key = fs.readFileSync(CERT_KEY);
        https.createServer({ key, cert }, server).listen(PORT, HOST, () => {
            console.log("Started (https): ", HOST, PORT);
            console.log("DB: ", db.namespace);
            server.use(
                "/v1",
                (req, res, next) => {
                    req["db"] = db;
                    next();
                },
                require("./v1")
            );
            server.get("/", (req, res) => {
                res.json({ ok: true });
            });
        });
    } catch (e) {
        http.createServer(server).listen(PORT, HOST, async () => {
            console.log("Started (http): ", HOST, PORT);
            console.log("DB: ", db.namespace);
            server.use(
                "/v1",
                (req, res, next) => {
                    req["db"] = db;
                    next();
                },
                require("./v1")
            );
            server.get("/", (req, res) => {
                res.json({ ok: true });
            });
        });
    }
});
