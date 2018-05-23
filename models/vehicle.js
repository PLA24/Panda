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
        required: true
    },
    bodytype: {
        type: String,
        required: true
    },
    maincolor: {
        type: String,
        required: true
    },
    economylabel: {
        type: String,
        required: true
    },
    timeSpotted: {
        type: Date,
        default: Date.now(),
        required: true
    },
    siteSpotted: {
        type: String,
        required: true
    }
});

const Vehicle = module.exports = mongoose.model('Vehicle', VehicleSchema);

module.exports.createVehicle = function (newVehicle, callback) {
    newVehicle.save(callback);
};