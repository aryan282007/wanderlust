const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const Listing = require("./modals/listing.js");
// const { link } = require("fs");

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
  console.log("mongoose is connected");
})
.catch(()=>{
  console.log("error in mongoose connection");
});

async function main() {
  await mongoose.connect(mongoose_url);
}

app.get("/allList", async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
});

app.get("/listing/new",(req,res)=>{
  res.render("listing/new.ejs");
})

app.post("/listing", async (req,res)=>{
  let newlist = new Listing(req.body.listing);
  await newlist.save();
  console.log(newlist);
  res.redirect("/allList");
})

app.get("/allList/:id/edit",async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
})

app.put("/allList/:id", async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true });
  res.redirect(`/listing/${id}`);
})

app.get("/listing/:id", async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show.ejs", {listing});
})

app.delete("/allList/:id",async(req,res)=>{
  let {id} = req.params;
   const listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   res.redirect("/allList");
})

app.get("/",(req,res)=>{
  res.send("i'm root");
});

app.listen(port,()=>{
  console.log(`server is hearing on ${port}`);
});