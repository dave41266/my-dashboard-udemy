const express = require('express');
const router = express.Router();
const passport = require('passport');
const {renderIndex, renderLogin, renderRegister, handleRegister, handleLogin, logOut}  = require('../controllers/authController');


router.route('/')
     .get(renderIndex);

// you have to type in the fields for email or pass or it won't work
// even the fields are pre-filled it won't work that way
router.route('/login')
    .get(renderLogin)
    // it's not working - says password or username incorrect, I'm redirect to home page
    // even if we fail untel we get it working
    // you have to use passport.authenticate or you won't get a post request
    //.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/icons' }), handleLogin)

router.route('/register')
    .get(renderRegister)
    .post(handleRegister);    

router.post('/login', function(req, res) {

    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to the dashboard " + user.username);
            console.log('Welcome to the dashboard ' + user.username)
            res.redirect("/");
        });
    });
})


router.route('/logout')
    .get(logOut)
    .post(renderLogin);

module.exports = {
    routes: router
}