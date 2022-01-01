const internal = require("express").Router();
const { INTERNAL } = require("../utils/paths");

internal.use(INTERNAL.COMPETE, require("./compete"));

module.exports = internal;
