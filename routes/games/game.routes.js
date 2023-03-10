const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');




router.get("/games", isLoggedIn, (req, res, next) => {
    res.render("game/all-game", {
        layout: "loggedin-user" 
    })
})


router.get("/nameofthegame", isLoggedIn, (req, res, next) => {
    res.render("game/single-game", {
        layout: "loggedin-user" 
    })
})




module.exports = router;