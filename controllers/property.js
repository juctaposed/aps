const PropertyModel = require("../models/Property");
const BuildingModel = require("../models/Building");
const acreApi = require('acre-api');


module.exports  = {

  searchProperty: async (req, res) => {
    const data = {
      streetNum: Number(req.body.streetNum), 
      street: req.body.street.trim()
    }
    try {
      console.log(req.body)
      acreApi.search(data.streetNum, data.street, async function(err, property) {
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
          // res.locals.record = property
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
              livableSquareFeet: building.livableSquareFeet,
              dateSearched: req.body.id, 
              searchedBy: req.user.id,

            }) 
            if(building){
              res.render("property", { building: buildingRecord });
          }
          else{
              res.render("property", { building: "No building found" });
          }}
        });
        acreApi.parcel.taxInfo(`${property.parcelId}`, async function(err, parcel) {
          if(err) {
            console.log(err);
          } else {
            console.log(`tax info`, parcel);
          }
        });
        acreApi.parcel.ownerHistory(`${property.parcelId}`, async function(err, parcel) {
          if(err) {
            console.log(err);
          } else {
            console.log(`owner info`, parcel);
          }
        });
        acreApi.parcel.comps(`${property.parcelId}`, async function(err, parcel) {
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
    // ------------------------
    //How we handling multiple res.render in one request?
    // function renderPage(req,res) {
    //   res.render("property")
    // }
  },
  // getBuildingInfo: async (req, res) => {
  //   acreApi.parcel.buildingInfo(`${property.parcelId}`, async function(err, building) {
  //     if(err) {
  //       console.log(err);
  //       return err
  //     } else {
  //       console.log(`building info`, building);
  //       const buildingRecord = await BuildingModel.create({
  //         useType: building.useType,
  //         totalRooms: building.totalRooms,
  //         basement: building.basement,
  //         style: building.style,
  //         bedrooms: building.bedrooms,
  //         stories: building.stories,
  //         grade: building.grade,
  //         fullBaths: building.fullBaths,
  //         halfBaths: building.halfBaths,
  //         fireplaces: building.fireplaces,
  //         exterior: building.exterior,
  //         roof: building.roof,
  //         cooling: building.cooling,
  //         livableSquareFeet: building.livableSquareFeet

  //       }) 
  //       // res.render("property", { building: buildingRecord });
  //       // res.locals.buildingRecord = building
  //     }
  //   });
  //   res.render("property", { building: buildingRecord });
  // }
};

