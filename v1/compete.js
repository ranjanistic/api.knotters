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
    const _competitions = await db
        .collection(competition)
        .find(
            { hidden: false },
            {
                projection: {
                    _id: 0,
                    banner: 0,
                    perks: 0,
                    creator_id: 0,
                    associate: 0,
                    modifiedOn: 0,
                },
            }
        )
        .toArray();
    const competitions = _competitions.map((comp)=>{
        comp.id = new Buffer.from(comp.id, 'base64').toString('hex');
        if (new Date(comp.startAt).getTime() <= new Date().getTime()){
            return comp
        }
        delete comp.taskSummary
        delete comp.taskDetail
        delete comp.taskSample
        return comp
    })
    return res.json({ competitions });
});

module.exports = compete;
