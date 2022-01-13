"use strict";

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const { BadRequestError } = require("../expressError");
const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");

router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
});

router.post("/decode", async function (req, res, next) {
    try {
        let token = req.body.token;
        let { username } = jwt.decode(token);
        console.log(username);
        return res.json({ username });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;