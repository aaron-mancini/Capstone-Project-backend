"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /auth/token */

describe("POST /auth/token", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "u1",
            password: "password1",
          });
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "no-such-user",
            password: "password1",
          });
      expect(resp.statusCode).toEqual(401);
    });
  
    test("unauth with wrong password", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "u1",
            password: "wrongpassword",
          });
      expect(resp.statusCode).toEqual(401);
    });
  
    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "u1",
          });
      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: 42,
            password: "above-is-a-number",
          });
      expect(resp.statusCode).toEqual(400);
    });
});

/** POST /auth/decode */

describe("POST /auth/decode", function () {
    test("works", async function () {
        const resp = await request(app)
            .post("/auth/decode")
            .send({ token: u1Token });
        expect(resp.body).toEqual({ username: "u1" })
    });
});