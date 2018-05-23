var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Vehicle = require('../models/vehicle');
const https = require('https');

/* Standard get. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.post('/newVehicle', [
    check('results.plate').isLength({min: 6, max: 6})
//    .custom etc
], function (req, res) {
    console.log(req.body);
    // res.json();
    const plate = req.body.results.plate;

    https.get('https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=KENTEKEN'.replace('KENTEKEN', plate), (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

    // const vehicle = new Vehicle({
    //
    // })
});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

module.exports = router;
