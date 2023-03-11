const { Router } = require("express");
const router = new Router();

const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");

const mongoose = require("mongoose");

const { isLoggedIn, isLoggedOut } = require("../../middleware/route-guard.js");

////////:DISPLAY ALL GAMME PAGE///////////
router.get("/games", isLoggedIn, (req, res, next) => {
  res.render("game/all-game", {
    layout: "loggedin-user",
  });
});

////////:DISPLAY SINGLE GAMME PAGE///////////
// router.get("/nameofthegame", isLoggedIn, (req, res, next) => {
//   res.render("game/single-game", {
//     userInSession: req.session.currentUser,
//     layout: "loggedin-user",
//   });
// });

////////:DISPLAY SNAKE///////////


// router.get("/snake", isLoggedIn, (req, res, next) => {
//   // console.debug(`${score}`)
//   res.send(`${score}`);
// });

router.get("/snake", isLoggedIn, (req, res, next) => {
    // Score.score = 100
    // Score.saveScore()
    // console.log(`${Score.score}`);
    res.render("game/snake", {
        userInSession: req.session.currentUser,
        layout: "game-layout",
    });
});

// création d'une route post pour récupérer le nouveau score du jeu
router.post("/snake", isLoggedIn, (req, res, next) => {
const { score } = req.body
console.log(score) // console log pour voir le score s'affiché
    res.json(`Score set successfully ${score}`);
    // doit créer then.create et mettre bdd
});

///// CREATE NEW COMMMENT////////IN PROGRES////////
router.post("/comment", isLoggedIn, (req, res, next) => {
  const { content } = req.body;
  const user = req.session.userId;
});

module.exports = router;
