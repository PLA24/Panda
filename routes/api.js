var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator/check");
const Vehicle = require("../models/vehicle");
const request = require("request");

router.post(
  "/newVehicle",
  [
    check("results[0].plate")
      // Lengte moet 6 zijn
      .isLength({ min: 6, max: 6 })
      .withMessage("Not a valid plate!")

      // Moet niet de afgelopen 5 minuten gespot zijn
      .custom(value => {
        const now = new Date();
        return Vehicle.findOne({ numberplate: req.body.results[0].plate }, function(
          err,
          vehicle
        ) {
          var difTime = vehicle.timeSpotted - now;
          var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
          if (diffMins < 5) {
            throw new Error("Vehicle already spotted within time-limit");
          }
        });
      })
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped()});
      }

    // Plate als tekst uit de results halen van ALPR
    let plate = req.body.results[0].plate;

    // Nieuw vehicle object maken en api url opstellen
    let vehicle = new Vehicle();
    const apiURL =
      "https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" + plate;

    // Request naar rdw API voor voertuig-data
    request(apiURL, { json: true }, (err, res, body) => {
      // Als er een error gegeven wordt door request(), print de error voor debugging
      if (err) {
        return console.log(err);
      }

      // Als de body van de gegven data uit de API niet leeg is
      if (body[0] != undefined) {
        // Overschrijft de data van het vehicle object, met data uit de api
        vehicle.numberplate = body[0].kenteken;
        vehicle.brand = body[0].merk;
        vehicle.tradename = body[0].handelsbenaming;
        vehicle.maincolor = body[0].eerste_kleur;
        vehicle.economylabel = body[0].zuinigheidslabel;

        // Roept de functie createVehicle aan om het vehicle object op te slaan in de database
        Vehicle.createVehicle(vehicle, err => {
          if (err) {
            throw err;
          }
        });

        // Als de body van de API-data wel leeg is, geef een erro
      } else {
        console.log("No data on plate!");
      }
    });
    next();
  }
);

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

module.exports = router;
