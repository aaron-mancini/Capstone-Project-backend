"use strict";

const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const db = require("../db.js");
const Review = require("./review.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Review.create */

describe("create", function () {
    const newReview = {
        movieId: "mid1234",
        username: "u1",
        review: "This is a new review",
        rating: 10,
    };

    test("works", async function () {
        let review = await Review.create(newReview);
        expect(review).toEqual(newReview);
        const found = await db.query("SELECT * FROM reviews WHERE user_username = 'u1' AND movie_id = 'mid1234'");
        expect(found.rows.length).toEqual(1);
    });

    test("bad request with dup data", async function () {
        try {
        await Review.create(newReview);
        await Review.create(newReview);
        fail();
        } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/** Review.getReviewsForMovie (get all reviews for one movie) */

describe("getReviewsForMovie", function () {
    test("works", async function () {
      const reviews = await Review.getReviewsforMovie('m1');
      expect(reviews).toEqual([
        {
          movie_id: "m1",
          review: "R1",
          rating: 1,
          username: "u1",
        },
        {
          movie_id: "m1",
          review: "R2",
          rating: 2,
          username: "u2",
        },
      ]);
    });
});

/** Review.getReviewsByUser (get all reviews written by one user) */

describe("getReviewsByUser", function () {
    test("works", async function () {
      const reviews = await Review.getReviewsByUser('u2');
      expect(reviews).toEqual([
        {
          id: expect.any(Number),
          movie_id: "m1",
          review: "R2",
          rating: 2,
          username: "u2",
        },
        {
          id: expect.any(Number),
          movie_id: "m2",
          review: "R3",
          rating: 3,
          username: "u2",
        },
      ]);
    });
});

/** Review.get (get a review by id) */

describe("get", function () {
    test("works", async function () {
      let review = await Review.get("1");
      expect(review).toEqual({
        id: 1,
        movie_id: "m1",
        review: "R1",
        rating: 1,
        username: "u1",
      });
    });
  
    test("not found if no such user", async function () {
      try {
        await Review.get("999");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
});

/** Review.update */

describe("update", function () {
    const updateData = {
      review_text: "NewReview",
      rating: 10,
    };
  
    test("works", async function () {
      let review = await Review.update("m1", "u1", updateData);
      expect(review).toEqual({
        user_username: "u1",
        movie_id: "m1",
        ...updateData,
      });
    });
  
    test("not found if no such review", async function () {
      try {
        await Review.update("notmovieId", "notu1", {
          review: "NewReview",
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      expect.assertions(1);
      try {
        await Review.update("m1", "u1", {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});

/** Review.remove (removes a review by id) */

describe("remove", function () {
    test("works", async function () {
      await Review.remove("1");
      const res = await db.query(
          "SELECT * FROM reviews WHERE id='1'");
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such review", async function () {
      try {
        await Review.remove("123");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
});