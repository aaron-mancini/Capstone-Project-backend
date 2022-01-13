"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

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
            username: "u1",
            review: "This is a new review",
            rating: "5",
          })
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        review: {
            movieId: "new123",
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
      expect(resp.statusCode).toEqual(400);
    });
  });