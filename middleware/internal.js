const { INTERNAL_SECRET } = require("../config");
const { mgm_apikey } = require("../utils/collections");

const internalOnly = async (req, res, next) => {
    const db = req["db"];
    const key =
        req.headers["authorization"] ||
        req.headers["Authorization"] ||
        req.body._INTERNAL_KEY;
    if (key === INTERNAL_SECRET) return next();
    const apikey = await db.collection(mgm_apikey).findOne({
        key: key,
        is_internal: true,
    });
    if (apikey) return next();
    return res.status(401).json({ error: "Unauthorized" });
};

module.exports = {
    internalOnly,
};
