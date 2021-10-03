const people = require("express").Router();
const { profile, user } = require("./collections");

people.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const profiles = db.collection(profile);
    const total = await profiles.find().count();
    const active = await profiles.find({ is_active: true }).count();
    const suspended = await profiles.find({ suspended: true }).count();
    const moderators = await profiles.find({ is_moderator: true }).count();
    const managers = await profiles.find({ is_manager: true }).count();
    return res.json({ total, active, suspended, moderators, managers });
});

module.exports = people;
