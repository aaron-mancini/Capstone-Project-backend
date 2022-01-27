"use strict";

const axios = require("axios");
const { API_KEY } = require("../config");

const BASE_URL = `http://www.omdbapi.com/`

class Movie {

    /** Find movie by title
     * 
     */

    static async get(movietitle, year) {
        const omdbRes = await axios.get(`${BASE_URL}?t=${movietitle}&y=${year}&apikey=${API_KEY}`);
        
        const movie = omdbRes.data;
        console.log(movie);

        return movie;
    }

    static async search(term) {
        const omdbRes = await axios.get(`${BASE_URL}?s=${term}&apikey=${API_KEY}`);
        const list = omdbRes.data;
        console.log(list);
        return list;
    }
}

module.exports = Movie;