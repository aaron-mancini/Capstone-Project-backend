"use strict";

const express = require("express");

const Review = require("../models/review");
const newReviewSchema = require("../schemas/newReview.json");
const updateReviewSchema = require("../schemas/updateReview.json");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");


const router = express.Router();

/** POST 
 * 
 *  Create a new review
 */

router.post("/", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newReviewSchema);
        if(!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const review = Review.create(req.body);
        return res.status(201).json({ review });
    } catch (error) {
        return next(error);
    }
});

/** GET all reviews by movieId /[movieId]
 * 
 */

router.get("/:movieId", async function(req, res, next) {
    try {
        const reviews = await Review.getReviewsforMovie(req.params.movieId);
        return res.json({ reviews });
    } catch (error) {
        return next(error);
    }
});

/** GET all reviews by a username /[username]
 * 
 */

 router.get("/:username", async function(req, res, next) {
    try {
        const reviews = await Review.getReviewsByUser(req.params.username);
        return res.json({ reviews });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /[username]/[movieId] 
 * 
 *  Update a user review
*/

router.patch("/:username/:movieId", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateReviewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const review = await Review.update(req.params.movieId, req.params.username, req.body);
        return res.json({ review });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /[username]/[movieId] 
 * 
 *  Delete a review
*/

router.delete("/:username/:movieId", async function(req, res, next) {
    try {
        await Review.remove(req.params.movieId, req.params.username);
        return res.json({ deleted: "Review" });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;