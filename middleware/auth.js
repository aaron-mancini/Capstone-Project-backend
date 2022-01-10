"use strict";

const jwt = require("jsonwebntoken");
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
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    ensureCorrectUser,
}