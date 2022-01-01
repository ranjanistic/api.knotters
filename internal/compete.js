const compete = require("express").Router();
var json2xls = require('json2xls');

const { internalOnly } = require("../middleware/internal");
const {
    competition,
    comp_submission,
    comp_submissionparticipant,
    profile,
    people_phonenumber,
    people_country,
    user,
} = require("../utils/collections");
const { b64ToBinary, binaryToHex } = require("../utils/uuid");
const Joi = require("joi");

compete.get("/submissions", async (req, res) => {
    const db = req["db"];
    delete req["db"];
    const competitions = await db
        .collection(competition)
        .find(
            { hidden: false },
            {
                projection: {
                    id: 1,
                    _id: 0,
                    title: 1,
                },
            }
        )
        .toArray();

    return res.render("submissions", {
        submitOn: req.originalUrl.split("?").shift(),
        competitions,
        error: req.query["e"],
    });
});

compete.post("/submissions", internalOnly, async (req, res) => {
    const db = req["db"];
    delete req["db"];

    const { error, value } = Joi.object({
        competition: Joi.string().required(),
        from_date: Joi.date().allow(null, "").default(null),
        to_date: Joi.date().allow(null, "").default(null),
    })
        .unknown(true)
        .validate(req.body);

    if (error) {
        return res.redirect(
            req.originalUrl.split("?").shift() + `?e=${error.message}`
        );
    }
    if (value.from_date && value.to_date && value.from_date > value.to_date){
        return res.redirect(
            req.originalUrl.split("?").shift() + `?e=from should be < to (date)`
        );
    }
    value.competition = b64ToBinary(value.competition);
    const submissions = await db
        .collection(comp_submission)
        .find(
            {
                competition_id: value.competition,
            },
            {
                projection: {
                    id: 1,
                    _id: 0,
                },
            }
        )
        .toArray();
    const submissionsIDs = submissions.map((sub) => sub.id);
    let submpartquery = {
        submission_id: { $in: submissionsIDs },
        confirmed: true,
    };
    if (value.from_date) {
        submpartquery = {
            ...submpartquery,
            confirmed_on: { $gte: value.from_date },
        };
    }
    if (value.to_date) {
        if (submpartquery.confirmed_on) {
            submpartquery.confirmed_on = {
                ...submpartquery.confirmed_on,
                $lte: value.to_date,
            };
        } else {
            submpartquery = {
                ...submpartquery,
                confirmed_on: { $lte: value.to_date },
            };
        }
    }
    const submparts = await db
        .collection(comp_submissionparticipant)
        .find(submpartquery, {
            projection: {
                _id: 0,
            },
        })
        .toArray();
    const profileIDs = submparts.map((sp) => sp.profile_id);
    const profiles = await db
        .collection(profile)
        .find(
            {
                id: { $in: profileIDs },
                suspended: false,
                to_be_zombie: false,
            },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    user_id: 1,
                    phone_number: 1,
                    githubID: 1,
                },
            }
        )
        .toArray();
    const userIDs = profiles.map((pr) => pr.user_id);
    const users = await db
        .collection(user)
        .find(
            {
                id: { $in: userIDs },
                is_active: true,
            },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                },
            }
        )
        .toArray();
    const phones = await db
        .collection(people_phonenumber)
        .find(
            {
                user_id: { $in: userIDs },
                verified: true,
            },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    user_id: 1,
                    number: 1,
                    country_id: 1,
                    primary: 1,
                },
            }
        )
        .toArray();
    const uniqueFilterList = (value, index, self) => {
        return self.indexOf(value) == index;
    };
    const countryIDs = phones
        .map((ph) => ph.country_id)
        .filter(uniqueFilterList);
    const countries = await db
        .collection(people_country)
        .find(
            {
                id: { $in: countryIDs },
            },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    code: 1,
                },
            }
        )
        .toArray();

    const participants = users.map((us) => ({
        id: binaryToHex(us.id),
        name: us.last_name ? `${us.first_name} ${us.last_name}` : us.first_name,
        phones: phones
            .map((ph) => {
                if (binaryToHex(ph.user_id) == binaryToHex(us.id)) {
                    return `${
                        countries.find(
                            (cn) =>
                                binaryToHex(cn.id) == binaryToHex(ph.country_id)
                        ).code
                    } ${ph.number}`;
                }
                return false;
            })
            .filter((ph) => ph),
        email: us.email,
        participateOn: submparts.find(
            (sp) =>
                binaryToHex(sp.profile_id) ==
                binaryToHex(
                    profiles.find(
                        (pr) => binaryToHex(pr.user_id) == binaryToHex(us.id)
                    ).id
                )
        ).confirmed_on,
    }));
    if(!participants.length){
        return res.redirect(
            req.originalUrl.split("?").shift() + `?e=No participants yet!`
        );
    }
    const xls = json2xls(participants);
    const contdisp = "attachment;filename="+ binaryToHex(value.competition)+ new Date()+".xlsx";
    res.writeHead(200, {
        'Content-Type': "application/vnd.ms-excel",
        'Content-disposition': contdisp,
        'Content-Length': xls.length
    });
    res.end(Buffer.from(xls, 'binary'));
});

module.exports = compete;
