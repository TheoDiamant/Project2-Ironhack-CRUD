const { Router } = require('express');
const router = new Router();

const User = require('../../models/User.model');
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');



router.get("/editinfo/:id", (req, res, next) => {
        console.log(req.session.currentUser._id)
        res.render("users/user-edit-info.hbs", { userInSession: req.session.currentUser })
    
})

router.post("/editinfo/:id", (req, res, next) => {
    const { username, email, password } = req.body;

    User.findByIdAndUpdate(req.session.currentUser._id,  {username}, {new: true})
    .then( () => {
        res.redirect("/")
    })
})




module.exports = router;