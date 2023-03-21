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
      Comment.find({ game: id })
      .populate("user")
        .then((allComments) => {
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
                .populate("comment")
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
                    comments: allComments,
                    game
                  });
                }
              })
              .catch((err) => next(err));
          } else {
            // Pour les autres jeux, rendre simplement la vue du jeu
            res.render(`game/${game.template}`, {
              userInSession: req.session.currentUser,
              layout: "game-layout",
              comments: allComments,
              game
            });
          }
        })
    })
    .catch((err) => next(err));

/*
    User.findOne({username: "testfinal"})
    .populate({
      path: "comments",
      populate: {
        path: "game",
        model: "Game"
      }
    })
    .then((user) => {
      console.log("User's comments:", user.comments);
      user.comments.forEach(comment => {
        console.log("Game associated with comment:", comment.game);
      });
    })
    .catch((err) => {
      console.error(err);
    });
    */
});



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
router.post("/game/:id/comments", isLoggedIn, (req, res, next) => {
  const { content } = req.body;
  const { id } = req.params;

  console.log("The id is", id)
  console.log("The content is", content)

  Comment.create({ content, user: req.session.currentUser._id, game: id })
    .then((newComment) => {
      return Game.findByIdAndUpdate(
       id,
        { $push: { comment: newComment._id } },
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
  
  
  router.post("/game/:id/like", isLoggedIn, async (req, res, next) => {
    try {
      const { like } = req.body;
      const { id } = req.params
  
      // Trouver l'utilisateur actuel dans la base de données
      const user = await User.findById(req.session.currentUser._id);
  
      // Trouver le jeu correspondant dans la base de données
      const gameObj = await Game.findById(id);
  
      // Créer un nouveau like
      const userlike = await Like.create({
        like,
        user: user,
        game: gameObj,
      });
  
      // Ajouter le nouveau like au jeu correspondant
      gameObj.like.push(userlike);
      await gameObj.save();
  
      // Ajouter le nouveau like à l'utilisateur
      user.like.push(userlike);
      await user.save();
  
      const response = { message: `Like set successfully for game ${gameObj.name}` };
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    User.findOne({username: "testfinal"})
    .then(user => {
        console.log(user);
      });
 
  });


  module.exports = router;
  
  