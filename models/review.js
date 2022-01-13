"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

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

    /** Update a Review */

    static async update(movieId, username, data) {
        const { setCols, values } = sqlForPartialUpdate(data);

        const movieIDVarIdx = "$" + (values.length + 1);
        const usernameVarIdx = "$" + (values.length + 2);

        const querySql = `UPDATE reviews
                        SET ${setCols}
                        WHERE movie_id = ${movieIDVarIdx} AND user_username = ${usernameVarIdx}
                        RETURNING movie_id,
                                  review_text,
                                  rating,
                                  user_username`;
        const result = await db.query(querySql, [...values, movieId, username]);
        const review = result.rows[0];

        if (!review) throw new NotFoundError(`No review`);

        return review;
    }

    /** Delete a review */

    static async remove(movieId, username) {
        let result = await db.query(
            `DELETE
             FROM reviews
             WHERE movie_id = $1 AND user_username = $2
             RETURNING user_username`,
            [movieId, username],
        );
        const review = result.rows[0];

        if (!review) throw new NotFoundError(`No review found`);
    }
}

module.exports = Review;