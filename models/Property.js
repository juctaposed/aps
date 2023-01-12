const mongoose = require("mongoose");

const MarketValueModel = new mongoose.Schema({
  this_year: {
    landValue: {
      type: Number
    },
    buildingValue: {
      type: Number
    },
    totalValue: {
      type: Number
    },
  },
  last_year: {
    landValue: {
      type: Number
    },
    buildingValue: {
      type: Number
    },
    totalValue: {
      type: Number
    },
  }
})

const PropertyModel = new mongoose.Schema({
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

  ownerCode: {
    type: String,
    required: false
  },

  school: {
    type: String,
    required: true,
  },
  recordingDate: {
    type: String,
    required: false,
  },

  lotArea: {
    type: Number,
    required: false,
  },
  salePrice: {
    type: Number,
    required: false,
  },

  fullMarketValues: MarketValueModel,

  searchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  dateSearched: {
    type: Date,
    default: Date.now,
  },

});

  

module.exports = mongoose.model("Property", PropertyModel);