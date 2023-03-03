const mongoose = require("mongoose");

const countyTaxHistorySchema = new mongoose.Schema({
  taxHistory: [
    {
      year: {
        type: String
      },
      details: {
        paidStatus: {
          type: String
        },
        tax: {
          type: Number
        }
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
    netTaxDueThisMonth: {type: Number},
    grossTaxDueNextMonth: {type: Number},
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