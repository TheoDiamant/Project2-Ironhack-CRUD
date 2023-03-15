const { Router } = require("express");
const router = new Router();

const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");
const Score = require("../../models/Score.model");

const Game = require("../../models/Game.model");

const mongoose = require("mongoose");

const { isLoggedIn, isLoggedOut, checkSnakeScore } = require("../../middleware/route-guard.js");
const { populate } = require("../../models/User.model");

////////:DISPLAY ALL GAMME PAGE///////////
router.get("/games", isLoggedIn, (req, res, next) => {

    Game.find()
    .then(allGames => {
        res.render("game/all-game", {
          layout: "loggedin-user",
          games: allGames
        });
    })

});

/*
router.get('/game/:id', isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const userId = req.session.currentUser._id;

  Game.findById(id)
    .then(game => {
      // Vérifiez si c'est le jeu Naruto et si l'utilisateur a fait au moins 5 points dans le jeu Snake
      if (game.template === 'naruto') {
        User.findOne({ _id: userId })
          .populate('score')
          .then(user => {
            const snakeScore = user.score.find(score => score.game.template === 'snake');
            if (!snakeScore || snakeScore.score < 5) {
              // Redirigez l'utilisateur vers une page d'erreur s'il n'a pas réussi à faire au moins 5 points dans le jeu Snake
              res.render('error', { message: "You don't have enough points to play Naruto" });
            } else {
              res.render(`game/${game.template}`, {
                userInSession: req.session.currentUser,
                layout: 'game-layout',
                game: game,
              });
            }
          })
          .catch(err => next(err));
      } else {
        // Pour les autres jeux, rendez simplement la vue du jeu
        res.render(`game/${game.template}`, {
          userInSession: req.session.currentUser,
          layout: 'game-layout',
          game: game,
        });
      }
    })
    .catch(err => next(err));
});

*/


router.get('/game/:id', isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Game.findById(id)
    .then(game => {
      res.render(`game/${game.template}`, {
        userInSession: req.session.currentUser,
        layout: 'game-layout',
        game: game,
      });
    })
    .catch(err => next(err));


    Game.findOne({name: "Naruto"})
    .populate("score")
    .then(teub => {
      console.log(teub)
    })

    Game.findOne({name: "Snake"})
    .populate("score")
    .then(teub => {
      console.log(teub)
    })

    User.findOne({username: "testfinal" })
    .populate("score")
    .then(teub => {
      console.log(teub)
    })
});


// création d'une route post pour récupérer le nouveau score du jeu
router.post("/scores", isLoggedIn, async (req, res, next) => {
  try {
    const { score, game } = req.body;

    // Trouver l'utilisateur actuel dans la base de données
    const user = await User.findById(req.session.currentUser._id);

    // Trouver le jeu correspondant dans la base de données
    const gameObj = await Game.findOne({ name: game });

    // Créer un nouveau score
    const userScore = await Score.create({ score, user: user._id, game: gameObj._id });

    // Ajouter le nouveau score au jeu correspondant
    gameObj.score.push(userScore);
    await gameObj.save();

    // Ajouter le nouveau score à l'utilisateur
    user.score.push(userScore);
    await user.save();

    const response = { message: `Score set successfully ${score}` };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/test", (req, res, next) => {
  res.render("game-layout")
})



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

module.exports = router
