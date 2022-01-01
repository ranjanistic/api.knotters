const v1 = require("express").Router();
const { V1, ROOT } = require("../utils/paths");
const { VERSION_1 } = require("../utils/strings");

v1.use(V1.PEOPLE, require(`.${V1.PEOPLE}`));
v1.use(V1.PROJECTS, require(`.${V1.PROJECTS}`));
v1.use(V1.COMPETE, require(`.${V1.COMPETE}`));
v1.get(ROOT, (_, res) => {
    res.json({
        version: VERSION_1,
        GET: [V1.PEOPLE, V1.PROJECTS, V1.COMPETE],
    });
});
// v1.post("/collections", internalOnly, (_, res) => {
//     return res.json({
//         version: VERSION_1,
//         collections,
//     });
// });

module.exports = v1;
