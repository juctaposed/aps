const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  previousOwner: {
    owner: String,
    saleDate: String,
    salePrice: Number
    }
});

const OwnerModel = new mongoose.Schema({
  parcelId: String,
  municipality: String,
  address: String,
  ownerName: String,
  deedBook: String,
  deedPage: String,
  ownerHistory: [OwnerSchema]
});

module.exports = mongoose.model('Owners', OwnerModel);


