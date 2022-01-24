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

/** POST /users */

describe("POST /users", function () {
  test("works", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "new@email.com",
        })
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
      }, token: expect.any(String),
    });
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "not-an-email",
        })
    expect(resp.statusCode).toEqual(400);
  });
});

/** GET /users/ */

describe("GET /users", function () {
  
    test("works for same user", async function () {
      const resp = await request(app)
          .get(`/users`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        user: {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
        },
      });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .get(`/users`);
      expect(resp.statusCode).toEqual(401);
    });
});

/** PATCH /users */

describe("PATCH /users", () => {
  
    test("works for same user", async function () {
      const resp = await request(app)
          .patch(`/users`)
          .send({
            firstName: "New",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        user: {
          username: "u1",
          firstName: "New",
          lastName: "U1L",
          email: "user1@user.com",
        },
      });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .patch(`/users`)
          .send({
            firstName: "New",
          });
      expect(resp.statusCode).toEqual(401);
    });
  
    test("bad request if invalid data", async function () {
      const resp = await request(app)
          .patch(`/users`)
          .send({
            firstName: 42,
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  
    test("works: can set new password", async function () {
      const resp = await request(app)
          .patch(`/users`)
          .send({
            password: "new-password",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        user: {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",         
        },
      });
      const isSuccessful = await User.authenticate("u1", "new-password");
      expect(isSuccessful).toBeTruthy();
    });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  
    test("works for same user", async function () {
      const resp = await request(app)
          .delete(`/users`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({ deleted: "u1" });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .delete(`/users`);
      expect(resp.statusCode).toEqual(401);
    });
});