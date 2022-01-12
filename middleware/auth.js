"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware is used to ensure a user logged in and must
 *  be the matching user to the username in the route param.
 * 
 */

function ensureCorrectUser (req, res, next) {
    try {
        const user = res.locals.user;

        if (!(user && user.username === req.params.username)) {
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
    ensureCorrectUser,
    authenticateJWT,
}