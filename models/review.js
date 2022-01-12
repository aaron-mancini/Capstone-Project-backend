"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

class Review {
    /** Create a review
     * 
     */

    static async create({ movieId, username, review, rating }) {
        const duplicateCheck = await db.query(
            `SELECT user_username,
                    movie_id
             FROM reviews
             WHERE user_username = $1 AND movie_id = $2`,
             [username, movieId]
        );

        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`Only one review per movie per user allowed!`)
        }

        const result = await db.query(
            `INSERT INTO reviews
             (movie_id,
              review_text,
              rating,
              user_username)
              VALUES ($1, $2, $3, $4)
              RETURNING movie_id, review_text, rating, user_username`,
            [movieId, review, rating, username]
        );

        const userReview = result.rows[0];

        return userReview;
    }

    /** Get all reviews for one movie
     * 
     */

    static async getReviewsforMovie(movieId) {
        const results = await db.query(
            `SELECT movie_id,
                    review_text AS "review",
                    rating,
                    user_username AS "username"
             FROM reviews
             WHERE movie_id = $1`,
            [movieId]
        );

        const reviews = results.rows;
        
        return reviews;
    }

    /** Get all reviews written by a user
     * 
     */

    static async getReviewsByUser(username) {
        const results = await db.query(
            `SELECT movie_id,
                    review_text,
                    rating,
                    user_username AS "username"
             FROM reviews
             WHERE username = $1`,
            [username]
        );

        const reviews = results.rows;
        
        return reviews;
    }
}

module.exports = Review;