"use strict";

const express = require("express");

const Movie = require("../models/movie");

const router = express.Router();

/** GET /[movietitle]
 *  
 *  Look up a movie by title.
 */

 router.get("/:year/:movietitle", async function (req, res, next) {
    try {
        const movie = await Movie.get(req.params.movietitle, req.params.year);
        return res.json({ movie });
    } catch (error) {
        return next(error);
    }
});

/** GET /search/[term]
 * 
 *  Query API to get list of movies related to search term
 */

router.get("/", async function (req, res, next) {
    try {
        const movie = await Movie.search(req.query.search);
        return res.json({ movie });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;