const mongoose = require("mongoose");
const BuildingModel = new mongoose.Schema({
    useType: {type: String},
    totalRooms: {type: Number},
    basement: {type: String},
    style: {type: String},
    bedrooms: {type: Number},
    grade: {type: String},
    stories: {type: Number},
    fullBaths: {type: Number},
    condition: {type: String},
    yearBuilt: {type: String},
    halfBaths: {type: Number},
    fireplaces: {type: Number},
    exterior: {type: String},
    heat: {type: String},
    garages: {type: Number},
    roof: {type: String},
    cooling: {type: String},
    livableSquareFeet: {type: Number},
    searchedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateSearched: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Building", BuildingModel);