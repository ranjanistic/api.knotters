const { INTERNAL_SECRET } = require("../config");

const internalOnly = async (req, res, next) => {
    const key =
        req.headers["authorization"] ||
        req.headers["Authorization"] ||
        req.body._INTERNAL_KEY;
    if (key === INTERNAL_SECRET) return next();
    return res.status(401).json({ error: "Unauthorized" });
};

module.exports = {
    internalOnly,
};
