const compete = require("express").Router();
const {
    competition,
    result,
    comp_submission,
    comp_event,
} = require("../utils/collections");
const { binaryToHex, uuidToBinary } = require("../utils/uuid");
compete.get("/", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const competitions = await db.collection(competition).count();
    const results = await db.collection(result).count();
    return res.json({
        competitions,
        results,
        GET: ["/all", "/{competeId}", "/events", "/event/{eventID}"],
    });
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

    const competitions = _competitions.map((comp) => {
        comp.id = binaryToHex(comp.id);
        if (new Date(comp.startAt).getTime() <= new Date().getTime()) {
            return comp;
        }
        delete comp.taskSummary;
        delete comp.taskDetail;
        delete comp.taskSample;
        return comp;
    });
    return res.json({ competitions });
});
compete.get("/events", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const _events = await db
        .collection(comp_event)
        .find(
            { is_public: true },
            {
                projection: {
                    _id: 0,
                    banner: 0,
                    creator_id: 0,
                    modifiedOn: 0,
                },
            }
        )
        .toArray();

    const events = _events.map((eve) => {
        eve.id = binaryToHex(eve.id);
        return eve;
    });
    return res.json({ events });
});
compete.get("/event/:eventID", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    let eveID = uuidToBinary(req.params.eventID);
    let query = {};
    if (!eveID) {
        query = {
            pseudonym: eveID,
            is_public: true,
        };
    } else {
        query = {
            id: eveID,
            is_public: true,
        };
    }
    const event = await db.collection(comp_event).findOne(query, {
        projection: {
            _id: 0,
            banner: 0,
            creator_id: 0,
            modifiedOn: 0,
        },
    });
    if (event) event.id = binaryToHex(event.id);
    return res.json({ event });
});

compete.get("/:competeId", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    let eveID = uuidToBinary(req.params.competeId);
    let query = {};
    if (!eveID) {
        query = {
            nickname: eveID,
            hidden: false,
        };
    } else {
        query = {
            id: eveID,
            hidden: false,
        };
    }
    const _competitions = await db
        .collection(competition)
        .find(query, {
            projection: {
                _id: 0,
                banner: 0,
                perks: 0,
                creator_id: 0,
                associate: 0,
                modifiedOn: 0,
            },
        })
        .toArray();
    const subms = await db
        .collection(comp_submission)
        .countDocuments({ competition_id: _competitions[0].id });

    const competitions = _competitions.map((comp) => {
        comp.id = binaryToHex(comp.id);
        if (new Date(comp.startAt).getTime() <= new Date().getTime()) {
            return comp;
        }
        delete comp.taskSummary;
        delete comp.taskDetail;
        delete comp.taskSample;
        return { ...comp  };
    });
    return res.json({ ...competitions[0], totalSubmissions:subms });
});

module.exports = compete;
