const Listing = require("../modals/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index =  async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
};

module.exports.newListing = (req,res)=>{
  res.render("listing/new.ejs");
};

module.exports.createListing = async (req,res,next)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  let newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  newlist.image = {url, filename};
  await newlist.save();
  req.flash("success","new Listing created!");
  console.log(newlist);
  res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","Listing not found!");
     return res.redirect("/listings");
  }
  let orginalUrl = listing.image.url;
  let orginalReplace = orginalUrl.replace("/upload","/upload/w_250"); 
  res.render("listing/edit.ejs",{listing, orginalReplace});
};

module.exports.updateListing = async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError("send valid data for listing",400);
  }
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
     req.flash("error","Listing not found!");
     return res.redirect("/listings");
  }
  res.render("listing/show.ejs", {listing});
};

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
   const listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   req.flash("success","Listing deleted!");
   res.redirect("/listings");
};

module.exports.categoryListing = async (req,res)=>{
  res.render("listing/category.ejs");
};