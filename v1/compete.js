const compete = require("express").Router();
const { competition, result } = require("./collections");

compete.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const competitions = await db.collection(competition).count();
    const results = await db.collection(result).count();
    return res.json({ competitions, results, GET: ["/all"] });
});

compete.get("/all", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const competitions = await db
        .collection(competition)
        .find(
            {},
            {
                projection: {
                    id: 0,
                    banner: 0,
                    perks: 0,
                    creator_id: 0,
                    associate: 0,
                    modifiedOn: 0,
                },
            }
        )
        .toArray();
    return res.json({ competitions });
});

module.exports = compete;
