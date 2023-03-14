const Game = require("../models/Game.model");

const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
  };
   
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };

  const checkSnakeScore = (req, res, next) => {
    const user = req.session.currentUser._id

    Game.findOne({ name: "Snake", "score.user": user })
    .then(snakeGame => {
      if (!snakeGame) {
        
        res.redirect("/snake"); 
      } else {
        const snakeScore = snakeGame.score.find(s => s.user.toString() === user.toString());
        if (snakeScore.score >= 5) {
          next(); 
        } else {
          res.redirect("/snake"); 
        }
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Erreur serveur");
    });
}

   
  module.exports = {
    isLoggedIn,
    isLoggedOut,
    checkSnakeScore
  };