const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../modals/listing.js");
// const { link } = require("fs");
const { listingSchema } = require("../schema.js");

const validateListing = (req,res,next) =>{
  const { error } = listingSchema.validate(req.body);
  if(error){
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(errMsg,400);
  }
  next();
}


router.get("/", asyncWrap(async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
}));

router.get("/new",(req,res)=>{
  res.render("listing/new.ejs");
})

router.post("/",validateListing, async (req,res,next)=>{
  let newlist = new Listing(req.body.listing);
  await newlist.save();
  console.log(newlist);
  res.redirect("/listings");
});

router.get("/:id/edit",asyncWrap(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
}));

router.put("/:id", validateListing, asyncWrap(async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError("send valid data for listing",400);
  }
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true });
  res.redirect(`/listings/${id}`);
}));

router.get("/:id", asyncWrap(async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listing/show.ejs", {listing});
}));

router.delete("/:id",asyncWrap(async(req,res)=>{
  let {id} = req.params;
   const listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   res.redirect("/listings");
}));


module.exports = router;