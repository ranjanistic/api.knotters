const projects = require("express").Router();
const { ROOT } = require("../utils/paths");
const {
    freeproject,
    verifiedproject,
    category,
    tag,
    reportedproject,
} = require("../utils/collections");
const { binaryToHex } = require("../utils/uuid");

projects.get(ROOT, async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const total_free = await db.collection(freeproject).count();
    const total_verified = await db.collection(verifiedproject).count();
    const total_approved = await db
        .collection(verifiedproject)
        .find({ status: "approved" })
        .count();
    const total_rejected = await db
        .collection(verifiedproject)
        .find({ status: "rejected" })
        .count();
    const total_pending = await db
        .collection(verifiedproject)
        .find({ status: "moderation" })
        .count();
    const total_reported = await db.collection(reportedproject).find().count();
    return res.json({
        total_projects: total_free + total_verified,
        total_free,
        total_approved,
        total_rejected,
        total_pending,
        total_reported,
        GET: ["/categories", "/tags"],
    });
});

projects.get("/categories", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const categories = db.collection(category);
    const total_categories = await categories.find().count();
    res.json({
        total_categories,
        GET: ["/all"],
    });
});

projects.get("/categories/all", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const categories = db.collection(category);
    const available_categories = (
        await categories.find({}, { projection: { name: 1, _id: 0, id:1 } }).toArray()
    ).map((cat) => ({
        id: binaryToHex(cat.id),
        name:cat.name
    }));
    res.json({
        available_categories,
    });
});

projects.get("/tags", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const tags = db.collection(tag);
    const total_tags = await tags.find().count();
    res.json({
        total_tags,
    });
});

module.exports = projects;
