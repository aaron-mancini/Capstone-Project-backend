"use strict";

const jsonschema = require("jsonschema");

const express = require("express");

const { BadRequestError } = require("../expressError");
const User = require("../models/user");




const router = express.Router();