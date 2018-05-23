var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Vehicle = require('../models/vehicle');
const request = require('request');

/* Standard get. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/newVehicle', [
    check('results.plate').isLength({min: 6, max: 6})
//    .custom etc
], function (req, res) {
    // console.log(req.body);
    // res.json();
    const plate = req.body.results.plate;
    console.log(req.body.results);

    let vehicle = new Vehicle();
    const apiURL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken='+plate;


    request(apiURL, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        vehicle.numberplate = body.kenteken;
        vehicle.brand = body.merk;
        vehicle.tradename = body.handelsbenaming;
        vehicle.mainColor = body.eerste_kleur;
        vehicle.economyLabel = body.zuinigheidslabel;

        console.log(body.url);
        console.log(body.explanation);
    });

    console.log(vehicle)


});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

module.exports = router;
