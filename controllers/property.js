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
         
          const buildingInfoPromise = new Promise((resolve, reject) => {
            acreApi.parcel.buildingInfo(`${property.parcelId}`, (err, building) => {
              if(err) {
                reject(err);
              } else {
                resolve(building);
              }
            });
          });
          const taxInfoPromise = new Promise((resolve, reject) => {
            acreApi.parcel.taxInfo(`${property.parcelId}`, (err, parcel) => {
              if(err) {
                reject(err);
              } else {
                resolve(parcel);
              }
            });
          });
          const ownerHistoryPromise = new Promise((resolve, reject) => {
            acreApi.parcel.ownerHistory(`${property.parcelId}`, (err, parcel) => {
              if(err) {
                reject(err);
              } else {
                resolve(parcel);
              }
            });
          });
          const compsPromise = new Promise((resolve, reject) => {
            acreApi.parcel.comps(`${property.parcelId}`, (err, parcel) => {
              if(err) {
                reject(err);
              } else {
                resolve(parcel);
              }
            });
          });

          const [buildingInfo, taxInfo, ownerHistory, comps] = await Promise.all([buildingInfoPromise,taxInfoPromise, ownerHistoryPromise, compsPromise]);
          if(buildingInfo){
            const buildingRecord = await BuildingModel.create({
              useType: buildingInfo.useType,
              totalRooms: buildingInfo.totalRooms,
              basement: buildingInfo.basement,
              style: buildingInfo.style,
              bedrooms: buildingInfo.bedrooms,
              stories: buildingInfo.stories,
              grade: buildingInfo.grade,
              fullBaths: buildingInfo.fullBaths,
              halfBaths: buildingInfo.halfBaths,
              fireplaces: buildingInfo.fireplaces,
              exterior: buildingInfo.exterior,
              roof: buildingInfo.roof,
              cooling: buildingInfo.cooling,
              livableSquareFeet: buildingInfo.livableSquareFeet,
              dateSearched: req.body.id, 
              searchedBy: req.user.id,
            });
            res.render("property", { property: record, building: buildingRecord, taxInfo: taxInfo, ownerHistory: ownerHistory, comps: comps });
          } else {
            res.render("property", { property: record, building: "No building found", taxInfo: taxInfo, ownerHistory: ownerHistory, comps: comps });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

