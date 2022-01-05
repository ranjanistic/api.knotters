const internal = require("express").Router();
const collections = require("../utils/collections");
const { INTERNAL } = require("../utils/paths");

const { internalOnly } = require("../middleware/authorize");

internal.use(INTERNAL.COMPETE, require("./compete"));

internal.get(INTERNAL.COLLECTIONS, internalOnly, (req, res) => {
    const cols = collections;
    delete cols.mgm_apikey;
    return res.json(cols);
});

module.exports = internal;
