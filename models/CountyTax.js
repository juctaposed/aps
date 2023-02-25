const mongoose = require("mongoose");

const countyTaxHistorySchema = new mongoose.Schema({
    taxHistory: [
      {
        year: {
          type: String
        },
        paidStatus: {
          type: String,
          default: ''
        },
        tax: {
          type: Number,
          default: 0
        }
      }
    ]
  });

const CountyTaxModel = new mongoose.Schema({
    parcelId: {type: String},
    municipality: {type: String},
    address: {type: String},
    ownerName: {type: String},
    taxBillAddr: {type: String},
    nextTaxDueThisMonth: {type: Number},
    grossTaxDueThisMonth: {type: Number},
    taxValue: {type: Number},
    millageRate: {type: Number},
    taxHistory: countyTaxHistorySchema,
    searchedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateSearched: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CountyTax", CountyTaxModel);