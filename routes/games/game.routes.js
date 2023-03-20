const { Router } = require("express");
const router = new Router();

const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");
const Score = require("../../models/Score.model");
const Like = require("../../models/Like.model");

const Game = require("../../models/Game.model");

const mongoose = require("mongoose");

const flash = require("connect-flash");

const {
  isLoggedIn,
  isLoggedOut,
  checkSnakeScore,
} = require("../../middleware/route-guard.js");
const { populate } = require("../../models/User.model");


////////:DISPLAY ALL GAMME PAGE///////////
router.get("/games", (req, res, next) => {
  const errorMessage = req.flash("error");
  Game.find().then((allGames) => {
    res.render("game/all-game", {
      layout: "loggedin-user",
      games: allGames,
      message: errorMessage,
    });
  });
});

router.get("/game/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;

  Game.findById(id)
    .then((game) => {
      Comment.find()
      .populate("user")
        .then((allComments) => {
          console.log("AL COMMENTS ARE",allComments)
          // Vérifiez si c'est le jeu Naruto et si l'utilisateur a fait au moins 5 points dans le jeu Snake
          if (game.name === "Naruto") {
            console.log("THE GAME IS", game.name);
            User.findOne({ _id: req.session.currentUser._id })
              .populate({
                path: "score",
                populate: {
                  path: "game",
                  model: "Game",
                },
              })
                .populate("comments")
              .then((user) => {
                console.log("The user username is", user);
                const snakeScores = user.score
                  .filter((score) => score.game.name === "Snake")
                  .map((score) => score.score);
                const maxSnakeScore = Math.max(...snakeScores);
                console.log(
                  "the biggest score is of the user is:",
                  maxSnakeScore,
                  "and all the scores of the user are",
                  snakeScores
                );
                if (!maxSnakeScore || maxSnakeScore < 5) {
                  // Redirigez l'utilisateur vers une page d'erreur s'il n'a pas réussi à faire au moins 5 points dans le jeu Snake
                  req.flash(
                    "error",
                    "You need to do 5 points in snake to play Naruto"
                  );
                  res.redirect("/games");
                } else {
                  res.render(`game/${game.template}`, {
                    userInSession: req.session.currentUser,
                    layout: "game-layout",
                    game: game,
                  });
                }
              })
              .catch((err) => next(err));
          } else {
            // Pour les autres jeux, rendre simplement la vue du jeu
            res.render(`game/${game.template}`, {
              userInSession: req.session.currentUser,
              layout: "game-layout",
              comments: allComments
            });
          }
        })
    })
    .catch((err) => next(err));
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
    const userScore = await Score.create({
      score,
      user: user._id,
      game: gameObj._id,
    });

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
    res.status(500).json({ error: "Internal server error" });
  }
});

///// USER CREATE NEW COMMMENT////////////////
router.post("/comment", isLoggedIn, (req, res, next) => {
  const { content } = req.body;

  console.log("The content is",content)

  Comment.create({ content, user: req.session.currentUser._id })   
   .then((newComment) => {
      return User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { comments: newComment._id } },
        { new: true }
      );
    })
    .then(() => {
      const response = { message: "Comment posted successfully" };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/like", isLoggedIn, async (req, res, next) => {
  try {
    const { like } = req.body;

    // Trouver l'utilisateur actuel dans la base de données
    const user = await User.findById(req.session.currentUser._id);

    // Trouver le jeu correspondant dans la base de données
    const gameObj = await Game.findOne({name: "Snake"});

    // Créer un nouveau like
    const userlike = await Score.create({
      like,
      user: user._id,
      game: gameObj._id,
    });

    // Ajouter le nouveau score au jeu correspondant
    gameObj.like.push(userlike);
    await gameObj.save();

    // Ajouter le nouveau like à l'utilisateur
    user.like.push(userlike);
    await user.save();

    const response = { message: `Score set successfully ${like}` };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  
  User.findOne({username: "testfinal"})
  .populate("score")
  .then(post => {
    console.log(post)
  })
  
});

module.exports = router;

