const mongoose = require("mongoose");

const connection = mongoose.createConnection('mongodb+srv://test:test@cluster0.zfwr0ys.mongodb.net/?retryWrites=true&w=majority', 
{ useNewUrlParser: true , 
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true 
})

const ParcelSchema = new mongoose.Schema({
  parcelId: String
});

const ParcelModel = connection.model('Parcel', ParcelSchema)

module.exports = ParcelModel;