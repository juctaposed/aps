const mongoose = require("mongoose");

const taxHistorySchema = new mongoose.Schema({
  paidStatus: { type: String, required: true },
  tax: { type: Number, required: true },
  penalty: { type: Number, required: true },
  interest: { type: Number, required: true },
  total: { type: Number, required: true },
  datePaid: { type: String, required: true }
});

const taxHistoryYearSchema = new mongoose.Schema({
  [String]: taxHistorySchema
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
    taxHistory: {
      type: Map,
      of: taxHistoryYearSchema
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

module.exports = mongoose.model("CountyTax", CountyTaxModel);