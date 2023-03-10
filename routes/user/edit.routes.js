const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');



router.get("/editinfo", (req, res, next) => {
        console.log(req.session.currentUser._id)
        res.render("users/user-edit-info.hbs", { userInSession: req.session.currentUser })
    
})

router.post("/editinfo", (req, res, next) => {

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