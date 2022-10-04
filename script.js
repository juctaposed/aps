const acreApi = require('acre-api');
const PropertyModel = require("./models/Property");
const mongoose = require('mongoose')
const testRecords = require('./parcels')
const ParcelModel = require("./models/Parcel");
const { parcel } = require('acre-api');



// async function addParcel() {
//     for (let i = 0; i < 5; i++){
//         try {
//             const records = await ParcelModel.create(parcelRecords)
//             console.log(JSON.stringify(records,'','\t'));
//             return JSON.stringify(records)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }
// }
// addParcel()


async function addParcel() {
	for (let i = 0; i < 5; i++) {
		try{
			const records = await acreApi.parcel.generalInfo(
				parcelRecords, function(err, parcel) {
					if(err) {
						return err;
					} else {
						return parcel;
					}
				});
			console.log(records,'','\t')
		} catch (error){
			console.log(error.message)
		}
	}
}
addParcel()

// acreApi.parcel.generalInfo(record, function(err, parcel) {
	
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(parcel);
// 	}
// });


// acreApi.search(1000, 'Liberty', function(err, parcel) {
	
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		// Logs generalInfo for parcel
// 		console.log(parcel);
// 	}
// });

// searchProperty: async (req, res) => {
//     try {
//       let streetNum = req.body.streetNum
//       let street = req.body.street
//       const result = await acreApi.street.street(1000, 'Liberty', function(err, parcels) {
//         if(err) {
//           return err
//           // console.log(err);
//         } else {
//           return parcels
//           // console.log(parcels);
//         }
//       });
//       await Property.insertOne({
//         owner: result.ownerName, ///duno if result. or req.body yet
//         address: result.address,
//         parcelId: result.parcelId,
//         municipality: result.municipality,
//         schoolDistrict: result.school,
//         deedRecording: result.recordingDate,
//         lotArea: result.lotArea
//       });
//       console.log("Results for ${address}");
//       // res.redirect("/property/:id");
//       res.render("property.ejs", { address: address, parcelId: req.user.parcelId });
//     } catch (err) {
//       console.log(err);
//     }
//   }



//   async function addStreet() {
//     for (let i = 0; i < streetsJSON.length; i++){
//         try {
//             const street = await Street.insertMany(streetsJSON)
//             console.log(JSON.stringify(street,'','\t'));
//             return JSON.stringify(street)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }
// }
// addStreet()


// async function addStreet() {
//     let newArr = []
//     const string = streets.join('').split(',')
//     const newString = `{street: ${string}},`
//     for (let i = 0; i < streets.length; i++){
//         try {
//             newArr.push(newString)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }
//     return newArr
//     console.log(newArr)
// }
// addStreet()