


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require("./utils/expressError.js");
const cors = require("cors");
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")




app.use(cors());



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

app.listen("8080", (req, res)=>{
   console.log("app is listening to port 8080") 
   
})


const validateListing =(req, res, next)=>{
  let {error} = listingSchema.validate(req.body);
    
    if(error){
      let errMsg  = error.details.map((el)=>el.message).join(",")
      throw new expressError(400, errMsg);
    }else{
      next()
    }
}

const validateReview =(req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
    
    if(error){
      let errMsg  = error.details.map((el)=>el.message).join(",")
      throw new expressError(400, errMsg);
    }else{
      next()
    }
}

//index route
app.get("/listings", async (req, res)=>{
  
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
});

//new route (create new lists)
app.get("/listings/new", (req, res)=>{
 
  res.render("listings/new.ejs")
})


//create route
app.post("/listings", validateListing, wrapAsync (async(req, res, next)=>{
  const newListing = new Listing(req.body.listing)
  await newListing.save();
  res.redirect("/listings")
 
 
})
);


//show route (show the data of lists)
app.get("/listings/:id", wrapAsync(async (req, res)=>{
  
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews")
  res.render("./listings/show.ejs", {listing})
}))




//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res)=>{
  
  let {id} = req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});
res.redirect(`/listings/${id}`)

}))

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) =>{
  
  let {id} = req.params;
 let deletedListing = await Listing.findByIdAndDelete(id);
 console.log("list is deleted");
 res.redirect("/listings")
}
))


//reviews
//Post review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review)

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();

     console.log("new review saved");
     res.redirect(`/listings/${listing._id}`)
}))

//delte review
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
  let {id, reviewId} =req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`)
}))



//edit route
app.get("/listings/:id/edit", wrapAsync (async (req, res)=>{
  
        let {id} = req.params;
  const listing = await Listing.findById(id)
  res.render("listings/edit.ejs", {listing})
}))


// app.all("*", (req, res, next)=>{
  
//   next(new expressError(404, "page not found"));
// });




app.use((err, req, res, next)=>{
  let {statusCode = 500, message = "somethin went wrond"} = err;
  res.status(statusCode).render("error.ejs", {message})
  //res.status(statusCode).send(message);  
})






