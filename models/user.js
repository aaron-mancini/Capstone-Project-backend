"use strict"

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
    /** Authenticate a user with username, password
     * 
     * Returns { username, first_name, last_name, email }
     */

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
             FROM users
             WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register a user
     * 
     *  Returns { username, firstName, lastName, email }
     */

    static async register({ username, password, firstName, lastName, email }) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
             (username,
              password,
              first_name,
              last_name,
              email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
            ],
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
     * 
     *  Returns [{ username, first_name, last_name, email }, ...]
     */

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
             FROM users
             ORDER BY username`,
        );

        return result.rows;
    }

    /** Get data about one user, given a username
     * 
     *  Returns { username, first_name, last_name }
     */

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
             FROM users
             WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }

    /** Update user data
     * 
     */
    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
            });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                       SET ${setCols}
                       WHERE username = ${usernameVarIdx}
                       RETURNING username,
                                 first_name AS "firstName",
                                 last_name AS "lastName",
                                 email`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete a user
     * 
     */

    static async remove(username) {
        let result = await db.query(
            `DELETE
             FROM users
             WHERE username = $1
             RETURNING username`,
            [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }
}

module.exports = User;