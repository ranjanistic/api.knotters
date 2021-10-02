const projects = require("express").Router();
const {
    projects: { freeproject, verifiedproject },
} = require("./collections");

projects.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const free = await db.collection(freeproject).count();
    const verified = await db.collection(verifiedproject).count();
    const approved = await db.collection(verifiedproject).find({status:'approved'}).count();
    const rejected = await db.collection(verifiedproject).find({status:'rejected'}).count();
    const pending = await db.collection(verifiedproject).find({status:'moderation'}).count();
    return res.json({ total: free + verified, free, approved, rejected, pending });
});

module.exports = projects;
