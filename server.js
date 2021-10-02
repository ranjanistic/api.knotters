const server = require("express")();
const { HOST, PORT } = require("./config");
const { attach } = require("./db");

attach((err, db) => {
    if (err) throw Error(err);
    server.listen(PORT, HOST, async () => {
        console.log("Started: ", HOST, PORT);
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
});
