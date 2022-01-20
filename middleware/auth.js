"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware is used to ensure a user logged in
 * 
 */

function ensureUser (req, res, next) {
    try {
        const user = res.locals.user;

        if (!(user)) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (error) {
        return next();
    }
}

module.exports = {
    ensureUser,
    authenticateJWT,
}