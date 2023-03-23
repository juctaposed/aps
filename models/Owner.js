const mongoose = require('mongoose');

const ownerHistorySchema = new mongoose.Schema({
  owner: { type: String, required: true },
  saleDate: { type: Date, required: true },
  salePrice: { type: Number, required: true }
});

const OwnerModel = new mongoose.Schema({
  parcelId: String,
  municipality: String,
  address: String,
  ownerName: String,
  deedBook: String,
  deedPage: String,
  ownerHistory: [ownerHistorySchema]
});

module.exports = mongoose.model('Owners', OwnerModel);


