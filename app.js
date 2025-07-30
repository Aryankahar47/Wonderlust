const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs")
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));



main().then((res)=>{
  console.log("connected")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
    
}

app.listen("8080", (req, res)=>{
   console.log("app is listening to port 8080") 
   
})

app.get("/", (req, res) =>{
    res.send("hi I am root!")
})

// app.get("/testListing", async (req, res)=>{
//       let sampleListing = new Listing({
//         title: "My new Villa",
//         discription: "In the center of city",
       
//         price: 9000,
//         location: "Vijay Nagar, Indore",
//         country: "India"
//       });

//       await sampleListing.save()
//         console.log("sample is listed")
//         res.send("sucessful")
// })

//index route
app.get("/listings", async (req, res)=>{
  
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
});


//new route (create new lists)
app.get("/listings/new", (req, res)=>{
  res.render("listings/new.ejs")
})


//show route (show the data of lists)
app.get("/listings/:id", async (req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  res.render("./listings/show.ejs", {listing})
})

app.post("/listings", async(req, res)=>{
  let newListing = new Listing(req.body.listing)
  await newListing.save();
  res.redirect("/listings")
})


//edit route
app.get("/listings/:id/edit", async (req, res)=>{
        let {id} = req.params;
  const listing = await Listing.findById(id)
  res.render("listings/edit.ejs", {listing})
})


//update route
app.put("/listings/:id", async (req, res)=>{
  let {id} = req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});
res.redirect(`/listings/${id}`)

})

//delete route
app.delete("/listings/:id", async (req, res) =>{
  let {id} = req.params;
 let deletedListing = await Listing.findByIdAndDelete(id);
 console.log("list is deleted");
 res.redirect("/listings")
}
)