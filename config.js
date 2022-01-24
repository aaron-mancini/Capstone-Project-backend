"use strict";

require("dotenv").config();

const { DB_URI } = process.env.DATABASE_URL || require("./key");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const { API_KEY } = process.env.API_KEY || require("./key");

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? DB_URI
        : process.env.DATABASE_URL || DB_URI;
}


const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    API_KEY,
};