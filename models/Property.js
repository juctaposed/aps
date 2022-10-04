const mongoose = require("mongoose");
	
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

  school: {
    type: String,
    required: true,
  },
  recordingDate: {
    type: String,
    required: false,
  },

  lotArea: {
    type: String,
    required: false,
  },
  salePrice: {
    type: String,
    required: false,
  },

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