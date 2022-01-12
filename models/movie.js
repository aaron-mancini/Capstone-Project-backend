"use strict";

const axios = require("axios");
const { API_KEY } = require("../key");

const BASE_URL = `http://www.omdbapi.com/`

class Movie {

    /** Find movie by title
     * 
     */

    static async get(movietitle) {
        const ombdRes = await axios.get(`${BASE_URL}?t=${movietitle}&apikey=${API_KEY}`);
        
        const movie = ombdRes.data;

        return movie;
    }

    static async search(term) {
        const ombdRes = await axios.get(`${BASE_URL}?s=${term}&apikey=${API_KEY}`);
        const list = ombdRes.data;
        return list;
    }
}

module.exports = Movie;