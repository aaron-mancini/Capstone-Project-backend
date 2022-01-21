# FilmRate
 
FilmRate is a web app that allows users to view film and tv show information from the obdb API. Users
can also make and account and write their own review for any film.

Movie API - OMDBAPI - http://www.omdbapi.com/

## Features

- Search for film by title and view data
- Account creation, edit, delete
- Review creation for any film
- Users can view other user reviews and view a list of all reviews they have written

## User flow / Structure

- A user without an account can search for films with the search bar and view data and reviews
  written by registered users.
- A user with a account can view their profile, reviews, and movie data as well as create their
  own reivews.

## API - OMDBAPI http://www.omdbapi.com/

This API contains a few enpoints to search for movie data. Data is fairly standard movie data.

## Project Tools and Dependencies

- React
  - bootstrap/reactstrap
  - axios
  - react-router-dom
- Node.js
  - Express.js
  - jsonwebtoken
  - jsonschema
  - cors
  - bcrypt
  - axios
- Postgresql

## Imporvements/Issues

- Search suggestion dropdown: add suggestions to a dropdown menu on the search bar
- Allow users to comment on other user reveiws and vote on reviews
- Allow users to friend other users
- Allow users to post a status message or "post"
- Add user statistics page which can track movie review data like their average review
  of a film by genre.
