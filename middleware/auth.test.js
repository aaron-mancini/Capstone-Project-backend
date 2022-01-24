"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
    authenticateJWT,
    ensureUser,
  } = require("./auth");

const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test" }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test" }, "notsecretkey");

describe("authenticateJWT", function () {
    test("works: via header", function () {
      expect.assertions(2);

      const req = { headers: { authorization: `Bearer ${testJwt}` } };
      const res = { locals: {} };
      const next = function (err) {
        expect(err).toBeFalsy();
      };
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({
        user: {
          iat: expect.any(Number),
          username: "test"
        },
      });
    });
  
    test("works: no header", function () {
      expect.assertions(2);
      const req = {};
      const res = { locals: {} };
      const next = function (err) {
        expect(err).toBeFalsy();
      };
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({});
    });
  
    test("works: invalid token", function () {
      expect.assertions(2);
      const req = { headers: { authorization: `Bearer ${badJwt}` } };
      const res = { locals: {} };
      const next = function (err) {
        expect(err).toBeFalsy();
      };
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({});
    });
  });

  describe("ensureUser", function () {
    test("works user", function () {
      expect.assertions(1);
      const req = { params: {} };
      const res = { locals: { user: { username: "test" } } };
      const next = function (err) {
        expect(err).toBeFalsy();
      };
      ensureUser(req, res, next);
    });
  
    test("unauth: if anon", function () {
      expect.assertions(1);
      const req = { params: {} };
      const res = { locals: {} };
      const next = function (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      };
      ensureUser(req, res, next);
    });
  });