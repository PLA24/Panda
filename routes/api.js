var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Vehicle = require('../models/vehicle');

/* Standard get. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/newVehicle', [
    // check('')
], function (req, res) {
    console.log(req.body);
    res.json(req.body);
    // const vehicle = new Vehicle({
    //
    // })
});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

module.exports = router;
