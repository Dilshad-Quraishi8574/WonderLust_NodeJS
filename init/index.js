const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Connection successfully);
main()
.then(()=>{
    console.log("Connections database Successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

const initDB = async()=>{
    await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  initData.data= initData.data.map((obj)=>({
    ...obj,
    owner:"65cef6cd924984f5f81042c8",
}))
    console.log("Data was initialized");
}
initDB();