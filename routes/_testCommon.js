"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Review = require("../models/review");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM reviews");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
  });

  await Review.create(
      {
        movieId: "mid123",
        username: "u1",
        review: "This is a new review",
        rating: "10",
      });
  await Review.create(
      {
        movieId: "mid1234",
        username: "u2",
        review: "This is a new review",
        rating: "10",
      });
  await Review.create(
      {
        movieId: "mid12345",
        username: "u3",
        review: "This is a new review",
        rating: "10",
      });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
