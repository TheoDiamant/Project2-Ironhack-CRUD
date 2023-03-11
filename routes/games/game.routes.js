const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const Comment = require('../../models/User.model');

const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');



////////:DISPLAY ALL GAMME PAGE///////////
router.get("/games", isLoggedIn, (req, res, next) => {
    res.render("game/all-game", {
        layout: "loggedin-user" 
    })
})

////////:DISPLAY SINGLE GAMME PAGE///////////
router.get("/nameofthegame", isLoggedIn, (req, res, next) => {
    res.render("game/single-game", {
        userInSession: req.session.currentUser,
        layout: "loggedin-user" 
    })
})

///// CREATE NEW COMMMENT////////IN PROGRES////////
router.post("/comment", isLoggedIn, (req, res, next) => {
    const { content } = req.body;
    const user = req.session.userId;
  
   
  });









module.exports = router;