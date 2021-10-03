const compete = require("express").Router();
const { competition, result } = require("./collections");

compete.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const competitions = await db.collection(competition).count();
    const results = await db.collection(result).count();
    return res.json({ competitions, results });
});

module.exports = compete;
