"use strict";

const jsonschema = require("jsonschema");

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const newUserSchema = require("../schemas/newUser.json");
const updateUserSchema = require("../schemas/updateUser.json");

const router = express.Router();

/** POST
 *  
 *  Registers a new user
 */

router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newUserSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
    } catch (error) {
        return next(error);
    }
});

/** GET => { users: [ {username, firstName, lastName }, ... ] }
 * 
 *  Returns list of all users
 */

router.get("/", async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (error) {
        return next(error);
    }
});

/** GET /[username]
 * 
 *  Returns info on one user
 * 
 */

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /[username]
 * 
 *  update a user
 */

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateUserSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /[username]
 * 
 */

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;