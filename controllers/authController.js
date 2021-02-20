'use strict';
//const {LocalStorage}  = require('node-localstorage');

const {LocalStorage} = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');


const renderIndex = (req, res, next) => {
    const user = localStorage.getItem('user');

    // do it like this, next step would be to auto-generate jason instead
        // of hard coding it
        //
        // see how to get the username from the login view
        // also have an array for images for each textName entry
        // their images are 800x800, so get some of them of that size
        // when you decide to add some more images
        //
        // learn to use JSON.stringify()

        console.log('indexView: before res.locals');

        // get some pictures when you have time
        res.locals = {userName: 'Mickey Mouse', userImage: 'z.png', layoutUsername: 'Jimbo',
            textName: [{name: 'Abraham Lincoln', image: 'y1.png'}, {name: 'Donald Trump', image: "y2.png"}, 
            {name: 'George Bush', image: 'y3.png'}, {name: 'Ronald Reagan', image: 'y4.png'},
                        {name: 'George Washington', image: 'y5.png'}]};

        //const locals = JSON.stringify({ success: function() { req.flash('success')}, 
        //    error: function() { req.flash('error')} });
            
        //console.log('indexView', locals);

    if (user != "" && user != null) {
        console.log('rendering home, user:', user);
        //res.render('home', {layout: 'homelayout', locals});
        res.render('home');
    }        
    else {
        console.log('rendering login');
        //res.render('login', {layout:'loginlayout', locals});
        res.render('login');
    }
}

const renderLogin = async (req, res, next) => {
    console.log('we land here after log out');

    console.log('user:', localStorage.getItem('user'));
    res.render('login', {layout: 'loginlayout', locals: res.locals});
}

const renderRegister = async (req, res, next) => {
    try {
       res.render('register', {layout: 'loginlayout'});
    } catch (error) {
        console.log(error);
    }
}

const User = require('../models/user');

//module.exports.renderRegister = (req, res) => {
//    res.render('users/register');
//}

// this code is working now!!!
const handleRegister = async (req, res, next) => {
    console.log("handleRegister")
    try {
        const { email, username, password} = req.body;
        const user = new User({ email, username });

        console.log(email, username, password);

        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
           if (err) return next(err);
                req.flash('success', 'Welcome!');
                res.redirect('/login');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('icons');
    }
}

// this gets called for the /postlogin route, the post method
// is called in login.ejs on the submit button
// if you get the email from req, then you can query the
// database on email and get the user name, then put
// that in local storage so I can get that in indexView
const handleLogin = (req, res, next) => {
    req.flash('success', 'welcome back!');
    req.flash('req:', req);

    console.log('success','welcome back');

    localStorage.setItem('user', 'anyone');
    const redirectUrl = req.session.returnTo;
    delete req.session.returnTo;

    // not cool. have to put these in multiple places
    res.locals = {userName: 'Mickey Mouse', userImage: 'z.png', layoutUsername: 'Jimbo',
            textName: [{name: 'Abraham Lincoln', image: 'y1.png'}, {name: 'Donald Trump', image: "y2.png"}, 
            {name: 'George Bush', image: 'y3.png'}, {name: 'Ronald Reagan', image: 'y4.png'},
                        {name: 'George Washington', image: 'y5.png'}]};


    console.log(res.locals);
    //res.render('home', {layout: 'homelayout', locals: res.locals});
    res.render('home');
}

const logOut = (req, res, next) => {
    localStorage.removeItem('user');
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/login');
}

module.exports = {
    renderIndex,
    renderLogin,
    renderRegister,
    handleRegister,
    handleLogin,
    logOut
}