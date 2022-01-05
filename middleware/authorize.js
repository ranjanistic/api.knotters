const { INTERNAL_SECRET } = require("../config");
const { getCache, setCache } = require("../utils/redis");
const { mgm_apikey } = require("../utils/collections");

const internalOnly = async (req, res, next) => {
    if (req["is_authorized"] && req["is_internal"]) return next();
    return res.status(401).json({ error: "Unauthorized" });
};
const setAuthLabel = async (req, _, next) => {
    const db = req["db"];
    const key =
        req.headers["authorization"] ||
        req.headers["Authorization"] ||
        req.body._INTERNAL_KEY;
    if (key === INTERNAL_SECRET) {
        req["is_authorized"] = true;
        req["is_internal"] = true;
    }
    let apikey = await getCache(`mgm_apikey_${key}`);
    if (!apikey) {
        apikey = await db.collection(mgm_apikey).findOne({
            key: key,
        });
        if (apikey) {
            await setCache(
                `mgm_apikey_${apikey.key}`,
                JSON.stringify(apikey),
                60
            );
        }
    } else {
        apikey = JSON.parse(apikey);
    }
    if (apikey) {
        req["is_authorized"] = true;
        req["is_internal"] = apikey.is_internal;
    }
    next();
};

module.exports = {
    internalOnly,
    setAuthLabel,
};
