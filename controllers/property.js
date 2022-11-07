const PropertyModel = require("../models/Property");
const BuildingModel = require("../models/Building");
// const express = require("express");
const acreApi = require('acre-api');



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
        acreApi.parcel.buildingInfo(`${property.parcelId}`, async function(err, building) {
          if(err) {
            console.log(err);
            return err
          } else {
            console.log(`building info`, building);
            const buildingRecord = await BuildingModel.create({
              useType: building.useType,
              totalRooms: building.totalRooms,
              basement: building.basement,
              style: building.style,
              bedrooms: building.bedrooms,
              stories: building.stories,
              grade: building.grade,
              fullBaths: building.fullBaths,
              halfBaths: building.halfBaths,
              fireplaces: building.fireplaces,
              exterior: building.exterior,
              roof: building.roof,
              cooling: building.cooling,
              livableSquareFeet: building.livableSquareFeet

            }) 
            res.render("property", { building: buildingRecord });
          }
        });
        acreApi.parcel.taxInfo(`${property.parcelId}`, function(err, parcel) {
          if(err) {
            console.log(err);
          } else {
            console.log(`tax info`, parcel);
          }
        });
        acreApi.parcel.ownerHistory(`${property.parcelId}`, function(err, parcel) {
          if(err) {
            console.log(err);
          } else {
            console.log(`owner info`, parcel);
          }
        });
        acreApi.parcel.comps(`${property.parcelId}`, function(err, parcel) {
          if(err) {
            console.log(err);
          } else {
            console.log(`comps info`, parcel);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
};

