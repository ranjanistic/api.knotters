require("dotenv").config();

module.exports = {
    SUPERSERVER: process.env.SUPERSERVER,
    DB_USER: process.env.DB_USER,
    DB_SECRET: process.env.DB_SECRET,
    DB_NAME: process.env.DB_NAME,
    DB_LINK: process.env.DB_LINK,
    HOST: process.env.HOST,
    PORT: Number(process.env.PORT),
};
