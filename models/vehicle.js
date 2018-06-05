var mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  numberplate: {
    type: String,
    required: true,
    index: true
  },
  brand: {
    type: String,
    required: true
  },
  tradename: {
    type: String,
    required: true
  },
  vehicletype: {
    type: String,
    required: true,
    default: "Persoonsauto"
  },
  // bodytype: {
  //     type: String,
  //     required: true
  // },
  maincolor: {
    type: String,
    required: true,
    default: "PIMPELPAARS"
  },
  economylabel: {
    type: String,
    required: true,
    default: "GEEN"
  },
  timeSpotted: {
    type: Date,
    required: true
  },
  siteSpotted: {
    type: String,
    required: true,
    default: "Pulse1"
  }
});

const Vehicle = (module.exports = mongoose.model("Vehicle", VehicleSchema));

module.exports.createVehicle = function(newVehicle, callback) {
  newVehicle.save(callback);
};
