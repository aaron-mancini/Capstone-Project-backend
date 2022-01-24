"use strict";

const express = require("express");

const Review = require("../models/review");
const newReviewSchema = require("../schemas/newReview.json");
const updateReviewSchema = require("../schemas/updateReview.json");
const { ensureUser } = require("../middleware/auth");
const jsonschema = require("jsonschema");
const { BadRequestError, UnauthorizedError } = require("../expressError");


const router = express.Router();

/** POST 
 * 
 *  Create a new review
 */

router.post("/", ensureUser, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newReviewSchema);
        if(!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const review = await Review.create(req.body);
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

/** GET all reviews by a username /user/[username]
 * 
 */

 router.get("/user/:username", async function(req, res, next) {
    try {
        const reviews = await Review.getReviewsByUser(req.params.username);
        return res.json({ reviews });
    } catch (error) {
        return next(error);
    }
});

/** GET one review by Id /id/[id]*/

router.get("/id/:id", async function(req, res, next) {
    try {
        const review = await Review.get(req.params.id);
        return res.json({ review });
    } catch (error) {
        return next(error);
    }
})

/** PATCH /[username]/[movieId] 
 * 
 *  Update a user review
*/

router.patch("/:id", ensureUser, async function(req, res, next) {
    try {
        let currUser = res.locals.user;

        const validator = jsonschema.validate(req.body, updateReviewSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const review = await Review.update(req.params.id, currUser.username, req.body);
        return res.json({ review });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /[username]/[movieId] 
 * 
 *  Delete a review
*/

router.delete("/:id", ensureUser, async function(req, res, next) {
    try {
        let user = res.locals.user;
        // query review by id
        let review = await Review.get(req.params.id);
        // check if username matches locals
        if (review.username !== user.username) throw new UnauthorizedError();

        await Review.remove(req.params.id);
        return res.json({ deleted: "Review" });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;