class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

/** 404 error */

class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

/** 401 error */

class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

/** 400 error */

class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

/** 403 error */

class ForbiddenError extends ExpressError {
    constructor(message = "Bad Request") {
        super(message, 403);
    }
}

module.exports = {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError,
}