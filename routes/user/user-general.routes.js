const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const Comment = require('../../models/User.model');

const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');



/////CREATE ROUTES FOR ALL GENERAL STUFF (LIKE, ETC)///////
//////MAYBE WE DONT NEED THAT ROUTES//////



module.exports = router;