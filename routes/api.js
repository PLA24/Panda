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

        // Haalt de laatste tijdstip op dat een voertuig al eens gespot is, en kijkt of dat minder dan 5 minuten geleden is
        return Vehicle.find({ numberplate: value })
          .sort({ timeSpotted: -1 })
          .limit(1)
          .then(vehicle => {
            if (vehicle[0]) {
              // Een berekening om het verschil van de 2 datumobjecten te krijgen, in afgeronde minuten
              var diffTime = vehicle[0].timeSpotted - now;
              var diffMins = Math.abs(
                Math.round(((diffTime % 86400000) % 3600000) / 60000)
              );

              if (diffMins < 5) {
                throw new Error(
                  "Vehicle already spotted within time-limit: " +
                    diffMins +
                    " minutes since last spot"
                );
              }
            }
          });
      })
  ],
  function(req, res, next) {
    // Als er errors zijn in de validatie, stuurt hij die terug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
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
        vehicle.timeSpotted = Date.now();

        // Roept de functie createVehicle aan om het vehicle object op te slaan in de database
        Vehicle.createVehicle(vehicle, err => {
          if (err) {
            throw err;
          }
        });

        // Als de body van de API-data wel leeg is, geef een error
      } else {
        console.log("No data on plate!");
      }
    });
    // 200 code als alles goed is, zodat hij niet blijft hangen in de request
    return res.status(200).json("Sucesfully uploaded data");
  }
);

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

module.exports = router;
