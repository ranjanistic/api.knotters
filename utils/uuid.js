const Binary = require("mongodb").Binary;
const uuid = require("uuid");

const binaryToHex = (binstr) => {
    return binstr.toString("hex");
};
const b64ToBinary = (bindata) => {
    return new Binary(
        new Buffer.from(bindata, "base64"),
        Binary.SUBTYPE_UUID_OLD
    );
};

const replaceAll = (str, find, replace) => {
    try {
        return str.replaceAll(find, replace);
    } catch {
        return str.replace(
            new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
            replace
        );
    }
};

const uuidToBinary = (uuidstr) => {
    try {
        return b64ToBinary(
            new Buffer.from(
                uuid.parse(uuidstr),
                "binary"
            ).toString("base64")
        );
    } catch(e) {
        console.log(e)
        return undefined;
    }
};

module.exports = {
    binaryToHex,
    b64ToBinary,
    uuidToBinary,
};
