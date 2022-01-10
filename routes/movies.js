"use strict";

const express = require("express");

const Movie = require("../models/movie");

const router = express.Router();

/** GET /[movietitle]
 *  
 *  Look up a movie by title.
 */

router.get("/:movietitle", async function (req, res, next) {
    try {
        const movie = await Movie.get(req.params.movietitle);
        return res.json({ movie });
    } catch (error) {
        return next(error);
    }
})

module.exports = router;