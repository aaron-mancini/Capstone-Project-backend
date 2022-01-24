"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /reviews */

describe("POST /reviews", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/reviews")
          .send({
            movieId: "new123",
            title: "newtitle",
            username: "u1",
            review: "This is a new review",
            rating: "5",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        review: {
            id: expect.any(Number),
            movieId: "new123",
            title: "newtitle",
            username: "u1",
            review: "This is a new review",
            rating: 5,
        }
      });
    });
  
    test("bad request if missing data", async function () {
      const resp = await request(app)
          .post("/reviews")
          .send({
            movieId: "new123",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request if invalid data", async function () {
      const resp = await request(app)
          .post("/reviews")
          .send({
            movieId: "new123",
            username: "u1",
            review: 123,
            rating: "5",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
});

/** GET /reviews/[movieId] */

describe("GET /reviews/:movieId", function () {
    test("works", async function () {
      const resp = await request(app)
          .get("/reviews/m1")
      expect(resp.body).toEqual({
        reviews: [
          {
            movie_id: "m1",
            title: "mt1",
            username: "u1",
            review: "R1",
            rating: 1,
          },
          {
            movie_id: "m1",
            title: "mt2",
            username: "u2",
            review: "R2",
            rating: 2,
          },
        ],
      });
    });
  
    test("fails: test next() handler", async function () {
      await db.query("DROP TABLE reviews CASCADE");
      const resp = await request(app)
          .get("/reviews/1")
      expect(resp.statusCode).toEqual(500);
    });
});

/** GET /reviews/user/[username] gets all reviews written by the user*/

describe("GET /reviews/user/:username", function () {
    test("works", async function () {
      const resp = await request(app)
          .get("/reviews/user/u2")
      expect(resp.body).toEqual({
        reviews: [
          {
            id: 2,
            movie_id: "m1",
            title: "mt2",
            username: "u2",
            review: "R2",
            rating: 2,
          },
          {
            id: 3,
            movie_id: "m2",
            title: "mt3",
            username: "u2",
            review: "R3",
            rating: 3,
          },
        ],
      });
    });
  
    test("fails: test next() handler", async function () {
      await db.query("DROP TABLE reviews CASCADE");
      const resp = await request(app)
          .get("/reviews/user/u2")
      expect(resp.statusCode).toEqual(500);
    });
});

/** GET /reviews/id/[id] gets a review by id*/

describe("GET /reviews/id/:id", function () {
    test("works", async function () {
      const resp = await request(app)
          .get("/reviews/id/2")
      expect(resp.body).toEqual({
        review: 
          {
            id: 2,
            movie_id: "m1",
            title: "mt2",
            username: "u2",
            review: "R2",
            rating: 2,
          },
      });
    });
  
    test("fails: test next() handler", async function () {
      await db.query("DROP TABLE reviews CASCADE");
      const resp = await request(app)
          .get("/reviews/id/2")
      expect(resp.statusCode).toEqual(500);
    });
});

/** PATCH /reviews/:id */

describe("PATCH /reviews/:id", () => {
  
    test("works for correct user", async function () {
      const resp = await request(app)
          .patch(`/reviews/m1`)
          .send({
            review_text: "New review",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        review: {
            movie_id: "m1",
            movie_title: "mt1",
            user_username: "u1",
            review_text: "New review",
            rating: 1,
        },
      });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .patch(`/reviews/m1`)
          .send({
            review: "New Review",
          });
      expect(resp.statusCode).toEqual(401);
    });
  
    test("bad request if invalid data", async function () {
      const resp = await request(app)
          .patch(`/reviews/m1`)
          .send({
            review: 42,
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
});

/** DELETE /reviews/:id */

// describe("DELETE /reviews/:id", function () {
  
//     test("works for correct user", async function () {
//       const resp = await request(app)
//           .delete(`/reviews/1`)
//           .set("authorization", `Bearer ${u1Token}`);
//       expect(resp.body).toEqual({ deleted: "Review" });
//     });
  
//     test("unauth if not same user", async function () {
//       const resp = await request(app)
//           .delete(`/reivews/1`)
//           .set("authorization", `Bearer ${u2Token}`);
//       expect(resp.statusCode).toEqual(401);
//     });
  
//     test("unauth for anon", async function () {
//       const resp = await request(app)
//           .delete(`/reviews/1`);
//       expect(resp.statusCode).toEqual(401);
//     });
// });