const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');


////////:DISPLAY EDIT INFO PAGE WITH LAYOUT FOR LOGGEDIN USER///////////
router.get("/editinfo", isLoggedIn, (req, res, next) => {
        console.log(req.session.currentUser._id)
        res.render("users/user-edit-info.hbs", { 
            userInSession: req.session.currentUser,
            layout: "loggedin-user.hbs" 
         })
    
})


////////RECEIVE EDIT INFO PAGE///////////
////////NEED TO DO 3 DIFFERENT FORMS FOR EACH FIELD////////
//////WHEN WE DO IN SINGLE FORM, IF YOU CHANGE ONLY ONE FIELD AND YOU UPDATE//////////
//////////////THE OTHER WILL BECOME EMPTY////

router.post("/editinfo", isLoggedIn, (req, res, next) => {

    const { username, email, password } = req.body;
    

    User.findByIdAndUpdate({ _id: req.session.currentUser._id }, { username, email, password },{ new: true })
    .then(user => {
        req.session.currentUser = user
        res.redirect("userProfile")
    })
    .catch(error => {
        console.log(error);
        res.redirect("/");
      });
})

////////DELETE THE USER ACCOUNT///////////
router.post("/delete",(req, res, next) => {
    User.findByIdAndRemove(req.session.currentUser._id)
    .then(() => {
      res.redirect("/")
    })
    .catch(err => {
      console.log(`Cant delete the account: ${err}`)
    })
  })

module.exports = router;