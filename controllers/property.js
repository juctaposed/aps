const PropertyModel = require("../models/Property");
const express = require("express");
const acreApi = require('acre-api');
// const callAcre = require('./lib/Api')
// const Connections = require('./lib/Connections')
// const Parser = require('./lib/Parser')
// const State = require('./lib/State')


module.exports  = {
  
  

  searchProperty: async (req, res) => {
    try {
      console.log(req.body)
      acreApi.search(Number(req.body.streetNum), req.body.street.trim(), async function(err, property) {
        if(err) {
          return err
          // console.log(err);
        } else {
            console.log(`property returned`, property)
            const record = await PropertyModel.create({
            ownerName: property.ownerName, 
            address: property.address,
            ownerCode: property.ownerCode,
            parcelId: property.parcelId,
            municipality: property.municipality,
            school: property.school,
            recordingDate: property.recordingDate,
            lotArea: property.lotArea,
            salePrice: property.salePrice,
            fullMarketValues: property.fullMarketValues,
            dateSearched: req.body.id, 
            searchedBy: req.user.id,
          });
          console.log(record.address)
          res.render("property", { property: record });
          // console.log(property);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
}

