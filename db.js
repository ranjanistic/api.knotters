const { MongoClient } = require("mongodb");
const { DB_LINK, DB_NAME } = require("./config");

module.exports = {
    attach: (onAttach = (error, db) => {}) =>
        MongoClient.connect(
            DB_LINK,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => onAttach(err, client.db(DB_NAME))
        ),
    detach: () => {},
};
