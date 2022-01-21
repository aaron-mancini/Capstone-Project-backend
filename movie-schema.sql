CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    date_created DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    movie_id TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL,
    date_created DATE DEFAULT CURRENT_TIMESTAMP,
    user_username TEXT NOT NULL
        REFERENCES users ON DELETE CASCADE
);

-- optionally add friends, posts, and comments tables as we 
-- get more complicated 