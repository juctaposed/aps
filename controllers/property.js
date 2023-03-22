const PropertyModel = require("../models/Property");
const BuildingModel = require("../models/Building");
const CountyTaxModel = require("../models/CountyTax")
const CompsModel = require("../models/Comp")
const OwnerModel = require("../models/Owner")
const acreApi = require('acre-api');
const local_millage_json = require("../data/localTax2022.json");
const school_millage_json = require("../data/schoolTax2022.json");

module.exports  = {

  searchProperty: async (req, res) => {
    const input = {
      streetNum: Number(req.body.streetNum), 
      street: req.body.street.trim()
    }
    try {
      console.log(req.body)
      acreApi.search(input.streetNum, input.street, async function(err, property) {
        if(err) {
          return err
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
          
          try {
            if (!result.address) {
              throw new Error("Address not found in result object");
            }
          } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
          }
          
          // if (!result.address) {
          //   return res.render("property", {
          //     property: null,
          //     building: null,
          //     countyTax: null,
          //     comps: null,
          //   });
          // }

          // Format "showing property detail for" address
          let formattedAddress = property.address.toLowerCase() // Convert to lowercase
            .replace(/\b[a-z]/g, (letter) => letter.toUpperCase()) // Capitalize the first letter of each word
            .replace(/(\d+)\s+(.+),\s+([a-z]{2})\s+(\d{5})/i, (match, number, street, state, zip) => `${number} ${street.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ${state.toUpperCase()}, ${zip}`); // Swap the state and zip code, and add a comma between the city and state
          formattedAddress = formattedAddress.replace(/(\d+)\s+(.+),/, (match, number, street) =>
            `${number} ${street.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')},`
          );

          console.log("formatted address: ", formattedAddress); 
          res.locals.formattedAddress = formattedAddress;
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
        acreApi.parcel.ownerHistory(`${property.parcelId}`, (err, owner) => { 
          if(err) { reject(err); } else { resolve(owner); } });
      });
      const compsPromise = new Promise((resolve, reject) => {
        acreApi.parcel.comps(`${property.parcelId}`, (err, comps) => { 
          if(err) { reject(err); } else { resolve(comps); }
        });
      });

      const [buildingInfo, ownerInfo, compsInfo, countyTaxInfo] = await Promise.all(
        [buildingInfoPromise, ownerHistoryPromise, compsPromise, countyTaxPromise]);

      for (const [key, value] of Object.entries(buildingInfo)) { 
        if (value === '') {
          buildingInfo[key] = 'N/A'; 
        }
      }
      
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
        netTaxDueThisMonth: countyTaxInfo.netTaxDueThisMonth,
        grossTaxDueNextMonth: countyTaxInfo.grossTaxDueNextMonth,
        taxValue: countyTaxInfo.taxValue,
        millageRate: countyTaxInfo.millageRate,
        taxHistory: countyTaxInfo.taxHistory,
        dateSearched: req.body.id, 
        searchedBy: req.user.id,
      });
      res.locals.countyTax = countyTaxRecord;
      
      for (const year in countyTaxInfo.taxHistory) {
        if (countyTaxInfo.taxHistory.hasOwnProperty(year)) {
          await CountyTaxModel.updateOne(countyTaxInfo.taxHistory[year])
          console.log(year, countyTaxInfo.taxHistory[year]);
        }
      }
      
      console.log('county tax info: ', countyTaxRecord)
      console.log('tax history: ', countyTaxInfo.taxHistory)

      const compsRecord = await CompsModel.create({
        parcelId: compsInfo.parcelId,
        municipality: compsInfo.municipality, 
        address: compsInfo.address,
        ownerName: compsInfo.ownerName,
        comps: compsInfo.comps,
        searchedBy: req.user.id,
        dateSearched: req.body.id
      });
      res.locals.comps = compsRecord;
      console.log('comparable parcels : ', compsRecord)
      
      for (const property in compsInfo.comps) {
        if (compsInfo.comps.hasOwnProperty(property)) {
          console.log(property, compsInfo.comps[property]);
        }
      }
      
      for(const [key,value] of Object.entries(ownerInfo)) {
        if (value === '') {
          ownerInfo[key] = 'N/A';
        }
      }

      const ownerRecord = await OwnerModel.create({
        parcelId: ownerInfo.parcelId,
        municipality: ownerInfo.municipality,
        address: ownerInfo.address,
        ownerName: ownerInfo.ownerName,
        deedBook: ownerInfo.deedBook,
        deedPage: ownerInfo.deedPage,
        ownerHistory: ownerInfo.ownerHistory,
        searchedBy: req.user.id,
        dateSearched: req.body.id
      });
      res.locals.owner = ownerRecord;
      console.log('owner history : ', ownerRecord)
      for (const ownerDetails in ownerInfo.owner) {
        if (ownerInfo.owner.hasOwnProperty(ownerDetails)) {
          console.log(ownerDetails, ownerInfo.owner[ownerDetails]);
        }
      }
      // Connect Millage JSON to Municipality of searched property
      const municipality_pattern = /\d+\s*(.*)/;
      const match = property.municipality.match(municipality_pattern);
      const municipalityMatch = match[1];

      const municipalityParts = municipalityMatch.split(/[-.]/); // Split the municipality string based on '-' and '.' delimiters
      const municipalitySubstring = municipalityParts[municipalityParts.length - 1].trim(); // Select the last part and trim any extra spaces

      let closingEscrows = [];

      console.log(`County Millage: ${countyTaxInfo.millageRate}`)
      console.log(`County Tax per year: ${property.countyAssessedValues.this_year.totalValue * (countyTaxInfo.millageRate / 1000)}`)
      console.log(`County Tax per month: ${property.countyAssessedValues.this_year.totalValue * (countyTaxInfo.millageRate / 1000)}`)
      closingEscrows.push(`${property.countyAssessedValues.this_year.totalValue * (countyTaxInfo.millageRate / 1000)}`)

      for (const record of local_millage_json) {
        if (record["Municipality"].toLowerCase().includes(municipalitySubstring.toLowerCase())) { // Convert both the searched substring and the record's Municipality value to lowercase for case-insensitive matching
          const millage_value = record['Millage'];
          console.log(`Local Millage: ${millage_value}`);
          console.log(`Local Tax per year: ${property.countyAssessedValues.this_year.totalValue * (millage_value / 1000)}`)
          console.log(`Local Tax per month: ${(property.countyAssessedValues.this_year.totalValue * (millage_value / 1000) / 12)}`)
          closingEscrows.push(`${(property.countyAssessedValues.this_year.totalValue * (millage_value / 1000) / 12)}`)
          break;
        }
      }
      for (const record of school_millage_json) {
        if (record["Municipality"].toLowerCase().includes(municipalitySubstring.toLowerCase())) { // Convert both the searched substring and the record's Municipality value to lowercase for case-insensitive matching
          const millage_value = record['Millage'];
          console.log(`School Millage: ${millage_value}`);
          console.log(`School Tax per year: ${property.countyAssessedValues.this_year.totalValue * (millage_value / 1000)}`)
          console.log(`School Tax per month: ${(property.countyAssessedValues.this_year.totalValue * (millage_value / 1000) / 12)}`)
          closingEscrows.push(`${(property.countyAssessedValues.this_year.totalValue * (millage_value / 1000) / 12)}`)
          break;
        }
      }

      closingEscrows = closingEscrows.map((value) => parseFloat(value));
      console.log(closingEscrows)
      const totalEscrow = closingEscrows.map(num => parseFloat(num.toFixed(2))).reduce((acc, current) => acc + current, 0)
      console.log('Total escrow $', totalEscrow)
      console.log('Total escrow with 150% buffer $', totalEscrow * 1.5)

      res.render("property");
    })
    } catch (err) {
      console.log(err)
    }
  }
}
