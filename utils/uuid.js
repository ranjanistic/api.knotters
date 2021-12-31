const binaryToHex = (binstr) => new Buffer.from(String(binstr), "binary").toString("hex");

module.exports = {
    binaryToHex
}
