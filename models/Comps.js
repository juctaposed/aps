const mongoose = require("mongoose");

const CompSchema = new mongoose.Schema({
    address: String,
    yearBuilt: String,
    parcelId: String,
    salePrice: Number,
    saleDate: String,
    livableSquareFeet: Number,
    landValue: Number,
    bldgValue: Number,
    totalValue: Number

})

const CompsModel = new mongoose.Schema({
    parcelId: {
        type: String,
        require: true,
    },
    municipality: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        require: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    comps: [CompSchema],
    searchedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateSearched: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comparables", CompsModel);