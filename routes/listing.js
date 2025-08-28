const express = require("express");
const router =express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")




//create route
router.post("/", isLoggedIn, validateListing, wrapAsync (async(req, res, next)=>{
  const newListing = new Listing(req.body.listing)
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "new list have been created")
  res.redirect("/listings")
 
 
})
);


//index route
router.get("/", wrapAsync(listingController.index)
);

//new route (create new lists)
router.get("/new", isLoggedIn, (req, res)=>{
  console.log(req.user)
  
  res.render("listings/new.ejs")
})





//show route (show the data of lists)
router.get("/:id", wrapAsync(async (req, res)=>{
  
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
     populate:{
      path:"author"}
    })
    .populate("owner");

  if(!listing){
     req.flash("error", "Your requested list does not exist");
     res.redirect("/listings")
  }else{
  res.render("./listings/show.ejs", {listing})
  }
  console.log(listing)
}))




//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res)=>{
  
  let {id} = req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});
 req.flash("success", "List Updated")
res.redirect(`/listings/${id}`)

}))

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) =>{
  
  let {id} = req.params;
 let deletedListing = await Listing.findByIdAndDelete(id);
 console.log("list is deleted");
 req.flash("success", "list Deleted")
 res.redirect("/listings")
}
))





//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync (async (req, res)=>{
  
        let {id} = req.params;
  const listing = await Listing.findById(id)
  
   req.flash("success", "List Edited")
   if(!listing){
     req.flash("error", "Your requested list does not exist");
      res.redirect("/listings")}
  
  res.render("listings/edit.ejs", {listing})
}))




module.exports = router;