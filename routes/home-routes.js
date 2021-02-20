const express = require('express');

const {renderIcons, renderMap, renderProfile, renderTable} = require('../controllers/homeController');
const router = express.Router();



router.get('/icons', renderIcons);
router.get('/map', renderMap);
router.get('/profile', renderProfile);
router.get('/table', renderTable);


module.exports = {
    routes: router
}