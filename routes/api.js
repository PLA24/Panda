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
    console.log("RESULTS");
    console.log(req.body.results);
    console.log("PLATE");
    let plate = req.body.results[0].plate;
    console.log(plate);

    let vehicle = new Vehicle();
    const apiURL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken='+plate;


    request(apiURL, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body[0]);
        vehicle.numberplate = body[0].kenteken;
        vehicle.brand = body[0].merk;
        vehicle.tradename = body[0].handelsbenaming;
        vehicle.mainColor = body[0].eerste_kleur;
        vehicle.economyLabel = body[0].zuinigheidslabel;
    });
    console.log("OBJECT");
    console.log(vehicle);


});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

module.exports = router;
