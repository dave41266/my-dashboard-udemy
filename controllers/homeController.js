'use strict';


//const {LocalStorage}  = require('node-localstorage');
//const localstorage = new LocalStorage('./scracth');


const renderIcons = (req, res, next) => {
    //var locals = JSON.stringify({currentUser: req.user, success: req.flash('success'), error: req.flash('error')});
    //console.log('iconsView', locals);
    res.render('icons');
}
 
const renderMap= (req, res, next) => {
    //var locals = JSON.stringify({currentUser: req.user, success: req.flash('success'), error: req.flash('error')});
    //console.log('mapView', locals);
    res.render('map');
}

const renderProfile = (req, res, next) => {
    //var locals = JSON.stringify({currentUser: req.user, success: req.flash('success'), error: req.flash('error')});
    //console.log('profileView', locals);
    res.render('profile');
}

const renderTable = (req, res, next) => {
    //var locals = JSON.stringify({currentUser: req.user, success: req.flash('success'), error: req.flash('error')});
    //console.log('tableView', locals);
    res.render('table');
}


module.exports = {
    renderIcons,
    renderMap,
    renderProfile,
    renderTable
}