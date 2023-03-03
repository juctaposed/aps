const PropertyModel = require("../models/Property");
const BuildingModel = require("../models/Building");
const CountyTaxModel = require("../models/CountyTax")
const CompsModel = require("../models/Comps")
const acreApi = require('acre-api');

// # TODO 
// render everything to views - probly gotta split routes / uri 

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
            const result = await PropertyModel.create({
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
              countyAssessedValues: property.countyAssessedValues,
              dateSearched: req.body.id, 
              searchedBy: req.user.id,
            });
            res.locals.property = result;
          console.log(result.address)
          console.log(result.countyAssessedValues)
          if (!result.address) {
            return res.render("property", {
              property: null,
              building: null,
              countyTax: null,
              comps: null,
            });
          }
        }
      const buildingInfoPromise = new Promise((resolve, reject) => {
        acreApi.parcel.buildingInfo(`${property.parcelId}`, (err, building) => {
          if(err) { reject(err); } else { resolve(building); }  });
      });
      const countyTaxPromise = new Promise((resolve, reject) => {
        acreApi.parcel.taxInfo(`${property.parcelId}`, (err, countyTax) => {
          if(err) { reject(err); } else { resolve(countyTax); } });
      });
      const ownerHistoryPromise = new Promise((resolve, reject) => {
        acreApi.parcel.ownerHistory(`${property.parcelId}`, (err, owners) => { 
          if(err) { reject(err); } else { resolve(owners); } });
      });
      const compsPromise = new Promise((resolve, reject) => {
        acreApi.parcel.comps(`${property.parcelId}`, (err, comps) => { 
          if(err) { reject(err); } else { resolve(comps); }
        });
      });

      const [buildingInfo, ownerHistory, compsInfo, countyTaxInfo] = await Promise.all([buildingInfoPromise, ownerHistoryPromise, compsPromise, countyTaxPromise]);
      for (const [key, value] of Object.entries(buildingInfo)) { if (value === '') {buildingInfo[key] = 'N/A'; }}
      
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
      res.locals.building = buildingRecord;
      console.log('building info: ', buildingRecord)
      
        
      const countyTaxRecord = await CountyTaxModel.create({
        parcelId: countyTaxInfo.parcelId,
        municipality: countyTaxInfo.municpality,
        address: countyTaxInfo.address,
        ownerName: countyTaxInfo.ownerName,
        taxBillAddr: countyTaxInfo.taxBillAddr,
        nextTaxDueThisMonth: countyTaxInfo.nextTaxDueThisMonth,
        grossTaxDueThisMonth: countyTaxInfo.grossTaxDueThisMonth,
        taxValue: countyTaxInfo.taxValue,
        millageRate: countyTaxInfo.millageRate,
        taxHistory: countyTaxInfo.taxHistory,
        dateSearched: req.body.id, 
        searchedBy: req.user.id,
      });
      res.locals.countyTax = countyTaxRecord;
      console.log('county tax info: ', countyTaxRecord)

      const compsRecord = await CompsModel.create({
        parcelId: compsInfo.parcelId,
        municipality: compsInfo.municipality, // Fixed typo in the property name
        address: compsInfo.address,
        ownerName: compsInfo.ownerName,
        comps: {
          address: compsInfo.address,
          yearBuilt: compsInfo.yearBuilt,
          parcelId: compsInfo.parcelId,
          salePrice: compsInfo.salePrice,
          saleDate: compsInfo.saleDate,
          livableSquareFeet: compsInfo.livableSquareFeet,
          landValue: compsInfo.landValue,
          bldgValue: compsInfo.bldgValue,
          totalValue: compsInfo.totalValue
        },
        searchedBy: req.user.id,
        dateSearched: req.body.id
      });
      res.locals.comps = compsRecord;
      console.log('comparable parcels : ', compsRecord)
      
      res.render("property");
    })
    } catch (err) {
      console.log(err)
    }
  }
}
