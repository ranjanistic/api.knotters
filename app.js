const server = require("express")();
const express = require("express");
const { ROOT, ROBOTS, V1 } = require("./utils/paths");
const { APPNAME } = require("./utils/strings");
const { rateLimit } = require("./middleware/ratelimit");
const helmet = require("helmet");

server.use(helmet());
server.use(rateLimit);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "pug");
server.set("trust proxy", 1);

server.get(ROOT, rateLimit, (_, res) => {
    res.json({
        name: APPNAME,
        revisions: [V1.ROOT],
        comments: [
            "This is the Knotters API. It is currently in development.",
            "Restricted to limited purposes only, evolving overtime.",
            "All responses contain list of further paths (GET, POST) and comments.",
        ],
    });
});

server.get(ROBOTS, (_, res) => {
    res.sendFile(__dirname + ROBOTS);
});

module.exports = server;
