const mongoose = require("mongoose");

const CompSchema = new mongoose.Schema({
        address: {type: String, required: true},
        yearBuilt: {type: String, required: true},
        parcelId: {type: String, required: true},
        salePrice: {type: Number, required: true},
        saleDate: {type: String, required: true},
        livableSquareFeet: {type: Number, required: true},
        landValue: {type: Number, required: true},
        bldgValue: {type: Number, required: true},
        totalValue: {type: Number, required: true}
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