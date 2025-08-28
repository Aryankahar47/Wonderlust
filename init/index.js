const mongoose = require("mongoose");
const initData = require("../init/data.js")
const Listing = require("../models/listing.js")

main().then((res)=>{
  console.log("connected")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
};

const initDB = async ()=>{
     await Listing.deleteMany();
     initData.data = initData.data.map((obj) => ({ ...obj, owner: "68ac72f427c9aa7793d3d32b"}))
     await Listing.insertMany(initData.data);
     console.log("data was initialized")
}

initDB();

