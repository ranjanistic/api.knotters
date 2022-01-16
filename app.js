const server = require("express")();
const cors = require("cors");
const express = require("express");
const { ROOT, ROBOTS, V1 } = require("./utils/paths");
const { APPNAME } = require("./utils/strings");
const helmet = require("helmet");

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "pug");
server.set("trust proxy", 1);
server.use(cors());

server.get(ROOT, (_, res) => {
    res.json({
        name: APPNAME,
        GET: [V1.ROOT],
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
