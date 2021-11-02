const server = require("express")(),
    { HOST, PORT, CERT_KEY, CERT_FILE } = require("./config"),
    { attach } = require("./db"),
    https = require("https"),
    http = require("http"),
    fs = require("fs");

attach((err, db) => {
    if (err) throw Error(err);
    const endpoints = () => {
        console.log("DB: ", db.namespace);
        server.use(
            "/v1",
            (req, _, next) => {
                req["db"] = db;
                next();
            },
            require("./v1")
        );
        server.get("/", (_, res) => {
            res.json({
                name: "Knotters API",
                revisions: ["/v1"],
                comments: [
                    "This is the Knotters API. It is currently in development.",
                    "Restricted to limited purposes only, evolving overtime.",
                    "All responses contain list of further paths (GET, POST) and comments.",
                ]
            });
        });
        server.get('/robots.txt', (_, res) => {
            res.sendFile(__dirname + '/robots.txt');
        })
        server.use((_, res) => {
            res.status(404).json({
                comments: ["Not found", "Check the path and try again.", "For example, try using /v1 GET path."],
            });
        });
    };

    try {
        const cert = fs.readFileSync(CERT_FILE);
        const key = fs.readFileSync(CERT_KEY);
        https.createServer({ key, cert }, server).listen(PORT, HOST, () => {
            console.log("Started (https): ", HOST, PORT);
            endpoints();
        });
    } catch (e) {
        http.createServer(server).listen(PORT, HOST, async () => {
            console.log("Started (http): ", HOST, PORT);
            endpoints();
        });
    }
});
