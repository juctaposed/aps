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
      acreApi.search(Number(req.body.streetNum), req.body.street.trim(), async function(err, parcels) {
        if(err) {
          return err
          // console.log(err);
        } else {
            console.log(`parcel returned`, parcels)
            const record = await PropertyModel.create({
            ownerName: parcels.ownerName, 
            address: parcels.address,
            parcelId: parcels.parcelId,
            municipality: parcels.municipality,
            school: parcels.school,
            recordingDate: parcels.recordingDate,
            lotArea: parcels.lotArea,
            dateSearched: req.body.id, 
            searchedBy: req.user.id
          });
          console.log("parcels for ${address}");
          console.log(record.address)
          // res.redirect("/property/:id");
          res.render("property", { property: record });
          // console.log(parcels);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  // searchProperty: async (req, res) => {
  //   try {
  //     let streetNum = req.body.streetNum
  //     let street = req.body.street
  //     const parcels = await acreApi.street.street(streetNum, street, function(err, parcels) {
  //       if(err) {
  //         console.log(err);
  //       } else {
  //         console.log(parcels);
  //       }
  //     });
  //     await Property.create({
  //       owner: parcels.ownerName, ///duno if parcels. or req.body yet
  //       address: parcels.address,
  //       parcelId: parcels.parcelId,
  //       municipality: parcels.municipality,
  //       schoolDistrict: parcels.school,
  //       deedRecording: parcels.recordingDate,
  //       lotArea: parcels.lotArea,
  //       user: req.user.id, ///dont need this?
  //     });
  //     console.log("parcelss for ${address}");
  //     // res.redirect("/property/:id");
  //     res.render("property.ejs", { address: address, parcelId: req.user.parcelId });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

}

