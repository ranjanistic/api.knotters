const people = require("express").Router();
const {
    profile,
    email,
    user,
    topic,
    profiletopic,
    blockeduser,
    reporteduser,
} = require("./collections");
const { binaryToHex } = require("../utils/uuid");

people.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const profiles = db.collection(profile);
    const users = db.collection(user);
    const emails = db.collection(email);
    const blockedusers = db.collection(blockeduser);
    const reportedusers = db.collection(reporteduser);
    const total_accounts = await emails
        .find({ verified: true, primary: true })
        .count();
    const total_users = await users.find({ is_active: true }).count();
    const total_profiles = await profiles.find().count();
    const active_profiles = await profiles.find({ is_active: true }).count();
    const suspended_profiles = await profiles.find({ suspended: true }).count();
    const total_blockings = await blockedusers.find().count();
    const total_reports = await reportedusers.find().count();
    const moderators = await profiles.find({ is_moderator: true }).count();
    const managers = await profiles.find({ is_manager: true }).count();
    return res.json({
        total_accounts,
        total_users,
        total_profiles,
        active_profiles,
        suspended_profiles,
        total_blockings,
        total_reports,
        moderators,
        managers,
        GET: ["/topics"],
        comments: [
            "*_profiles, *_users could indicate extra numbers due to unverified accounts",
            "*_accounts contain verified numbers only.",
        ],
    });
});

people.get("/topics", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const topics = db.collection(topic);
    const proftopics = db.collection(profiletopic);
    const total_topics = await topics.find().count();
    const profile_topics = await proftopics.find({ trashed: false }).count();
    const hidden_profile_topics = await proftopics
        .find({ trashed: true })
        .count();
    return res.json({
        total_topics,
        profile_topics,
        hidden_profile_topics,
        GET: ["/all"],
    });
});
people.get("/topics/all", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const topics = db.collection(topic);
    const available_topics = (
        await topics
            .find({}, { projection: { _id: 0, id: 1, name: 1 } })
            .toArray()
    ).map((top) => ({
        id: binaryToHex(top.id),
        name: top.name,
    }));
    return res.json({
        available_topics,
    });
});

module.exports = people;
