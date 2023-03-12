const { Router } = require("express");
const router = new Router();

const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");
const Score = require("../../models/Score.model");

const snakeConfig = require("../../public/snake-config");
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
        gameTitle: snakeConfig.gameTitle,
        gameScriptPath: snakeConfig.gameScriptPath,
        gameStylesheetPath: snakeConfig.gameStylesheetPath
      });
});

// création d'une route post pour récupérer le nouveau score du jeu
router.post("/snake", isLoggedIn, (req, res, next) => {
    const { score } = req.body;
  
    Score.create({ score })
      .then(userScore => {
        return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { score: userScore._id } }, { new: true })
          .then(() => {
            const response = { message: `Score set successfully ${score}` };
            res.json(response);
            res.end();
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });




///// USER CREATE NEW COMMMENT////////////////
router.post("/comment", isLoggedIn, (req, res, next) => {
    const { content } = req.body;
  
    Comment.create({ content })
      .then(newComment => {
        return User.findByIdAndUpdate(
          req.session.currentUser._id, 
          { $push: { comments: newComment._id } },
          { new: true }
        );
      })
      .then(() => {
        const response = { message: 'Comment posted successfully' };
        res.status(200).json(response);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });

module.exports = router;
