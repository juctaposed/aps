const PropertyModel = require("../models/Property");
const BuildingModel = require("../models/Building");
const CountyTaxModel = require("../models/CountyTax")
const CompsModel = require("../models/Comps")
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
            countyAssessedValues: property.countyAssessedValues,
            dateSearched: req.body.id, 
            searchedBy: req.user.id,
          });
          console.log(record.address)

          console.log(record.countyAssessedValues)
          const buildingInfoPromise = new Promise((resolve, reject) => {
            acreApi.parcel.buildingInfo(`${property.parcelId}`, (err, building) => {
              if(err) {
                reject(err);
              } else {
                resolve(building);
              }
            });
          });
          const countyTaxPromise = new Promise((resolve, reject) => {
            acreApi.parcel.taxInfo(`${property.parcelId}`, (err, countyTax) => {
              if(err) {
                reject(err);
              } else {
                resolve(countyTax);
              }
            });
          });
          const ownerHistoryPromise = new Promise((resolve, reject) => {
            acreApi.parcel.ownerHistory(`${property.parcelId}`, (err, comps) => {
              if(err) {
                reject(err);
              } else {
                resolve(comps);
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
          const [buildingInfo, ownerHistory, compsInfo, countyTaxInfo] = await Promise.all([
            buildingInfoPromise,
            countyTaxPromise, 
            ownerHistoryPromise, 
            compsPromise
          ]);
          // Create new countyTaxRecord
          if(countyTaxInfo) {
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
            console.log('county tax info: ', countyTaxRecord)
          }
          if (compsInfo) {
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
            console.log('comparable parcels : ', compsRecord)
          }
          // Render the property template with the data
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
            console.log('building info: ', buildingRecord)
            res.render("property", { property: record, building: buildingRecord });
          } else {
            res.render("property", { property: record, building: "No building found" });
          }
          }
        });
    } catch (err) {
      console.log(err);
    }
  },
  // getBuildingInfo: async (parcelId) => {
  // try {
  //   const buildingInfoPromise = new Promise((resolve, reject) => {
  //     acreApi.parcel.buildingInfo(`${parcelId}`, (err, building) => {
  //       if(err) {
  //         reject(err);
  //       } else {
  //         resolve(building);
  //       }
  //     });
  //   });
  //     const buildingInfo = await buildingInfoPromise;
  //     const buildingRecord = await BuildingModel.create({
  //           useType: buildingInfo.useType,
  //           totalRooms: buildingInfo.totalRooms,
  //           basement: buildingInfo.basement,
  //           style: buildingInfo.style,
  //           bedrooms: buildingInfo.bedrooms,
  //           stories: buildingInfo.stories,
  //           // other properties
  //         });
  //     return buildingRecord;
  // } catch (error) {
  //     console.error(error);
  // }
  // },
  // getCountyTaxInfo: async (parcelId) => {
  // try {
  //   const countyTaxInfoPromise = new Promise((resolve, reject) => {
  //     acreApi.parcel.countyTaxInfo(`${parcelId}`, (err, building) => {
  //       if(err) {
  //         reject(err);
  //       } else {
  //         resolve(building);
  //       }
  //     });
  //   });
  //     const countyTaxInfo = await countyTaxInfoPromise;
  //     const countyTaxInfoRecord = await CountyTaxModel.create({
  //           useType: buildingInfo.useType,
  //           totalRooms: buildingInfo.totalRooms,
  //           basement: buildingInfo.basement,
  //           style: buildingInfo.style,
  //           bedrooms: buildingInfo.bedrooms,
  //           stories: buildingInfo.stories,
  //           // other properties
  //         });
  //     return countyTaxInfoRecord;
  // } catch (error) {
  //     console.error(error);
  // }
  // }
};





// module.exports = {

//   searchProperty: async (req, res) => {
//     const data = {
//       streetNum: Number(req.body.streetNum), 
//       street: req.body.street.trim()
//     }
//     try {
//       console.log(req.body)
//       const property = acreApi.search(data.streetNum, data.street, async function(err, property) {
//         if(err) {
//           return err
//           // console.log(err);
//         } else {
//             console.log(`property returned`, property)
//             const record = await PropertyModel.create({
//             ownerName: property.ownerName, 
//             address: property.address,
//             ownerCode: property.ownerCode,
//             parcelId: property.parcelId,
//             municipality: property.municipality,
//             school: property.school,
//             recordingDate: property.recordingDate,
//             lotArea: property.lotArea,
//             salePrice: property.salePrice,
//             fullMarketValues: property.fullMarketValues,
//             dateSearched: req.body.id, 
//             searchedBy: req.user.id,
//           });
//           console.log(record.address)
//           return property
//         }
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   getCountyTaxRecord: async (property) => {
//     try {
//       const countyTaxPromise = new Promise((resolve, reject) => {
//         acreApi.parcel.taxInfo(`${property.parcelId}`, (err, countyTax) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(countyTax);
//           }
//         });
//       });
//       const countyTaxInfo = await countyTaxPromise;
//       const countyTaxRecord = await CountyTaxModel.create({
//         parcelId: countyTaxInfo.parcelId,
//         municipality: countyTaxInfo.municipality,
//         address: countyTaxInfo.address,
//         ownerName: countyTaxInfo.ownerName,
//         taxBillAddr: countyTaxInfo.taxBillAddr,
//         nextTaxDueThisMonth: countyTaxInfo.nextTaxDueThisMonth,
//         grossTaxDueThisMonth: countyTaxInfo.grossTaxDueThisMonth,
//         taxValue: countyTaxInfo.taxValue,
//         millageRate: countyTaxInfo.millageRate,
//         taxHistory: countyTaxInfo.taxHistory,
//         dateSearched: req.body.id, 
//         searchedBy: req.user.id,
//       });
//       res.render("property", { countyTaxRecord });
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   getBuildingInfo: async (property) => {
//     try {
//       const buildingPromise = new Promise((resolve, reject) => {
//         acreApi.parcel.buildingInfo(`${property.parcelId}`, (err, building) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(building);
//           }
//         });
//       });
//       const buildingInfo = await buildingPromise;
//       const buildingRecord = await BuildingModel.create({
//         useType: buildingInfo.useType,
//         totalRooms: buildingInfo.totalRooms,
//         basement: buildingInfo.basement,
//         style: buildingInfo.style,
//         bedrooms: buildingInfo.bedrooms,
//         stories: buildingInfo.stories,
//         yearBuilt: buildingInfo.yearBuilt,
//         livingArea: buildingInfo.livingArea,
//         dateSearched: req.body.id, 
//         searchedBy: req.user.id,
//       });
//       res.render("property", { buildingRecord });
//     } catch (err) {
//       console.log(err);
//     }
//   }

// }