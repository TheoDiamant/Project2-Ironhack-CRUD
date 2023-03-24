const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


 
// GET route ==> to display the signup form to users
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', isLoggedOut, (req, res, next) => {
    // console.log("The form data: ", req.body);
   
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }

        // make sure passwords are strong:
      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          email,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          password: hashedPassword
        });
      })
      .then(userFromDB => {
        res.redirect('/userProfile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      });
  });

  // GET route ==> to display the login form to users
  router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

   // POST login route ==> to process form data
router.post('/login', isLoggedOut, (req, res, next) => {
    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {

        req.session.currentUser = user;
        res.redirect("/games")

        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

  router.get('/userProfile', isLoggedIn, async (req, res) => {
    try {
      const user = await User.findById(req.session.currentUser._id).populate({
        path: 'score',
        populate: {
          path: 'game',
          model: 'Game'
        }
      }).populate('like.game');
      
      const scores = user.score.map(score => {
        return {
          score: score.score,
          gameName: score.game.name
        }
      });
  
      const scoresByGame = {};
      user.score.forEach(score => {
        const gameName = score.game.name;
        if (!scoresByGame[gameName]) {
          scoresByGame[gameName] = [];
        }
        scoresByGame[gameName].push(score.score);
      });
      const highScoresByGame = Object.entries(scoresByGame).map(([gameName, scores]) => {
        return {
          gameName: gameName,
          highScore: scores.reduce((acc, curr) => Math.max(acc, curr), 0)
        };
      });
  
      const gamesLiked = user.like.map((like) => like.game);

      res.render('users/user-profile', { 
        userInSession: req.session.currentUser,
        scores: user.score,
        layout: "loggedin-user.hbs",
        highScoresByGame: highScoresByGame,
        gamesLiked: gamesLiked,
      });
      } catch (err) {
        console.log(err);
        res.redirect('/login');
      }
  });

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

  



module.exports = router;