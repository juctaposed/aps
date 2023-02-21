const mongoose = require('mongoose');

const OwnersSchema = new mongoose.Schema({
  owner: String,
  saleDate: String,
  salePrice: Number
});

const OwnerHistoryModel = new mongoose.Schema({
  parcelId: String,
  municipality: String,
  address: String,
  ownerName: String,
  deedBook: String,
  deedPage: String,
  ownerHistory: [OwnersSchema]
});

module.exports = mongoose.model('Owners History', OwnerHistoryModel);


