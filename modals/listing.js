const { ref } = require("joi");
const mongoose = require("mongoose");
const reviews = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,
  location: String,
  country: String,
  reviews :[{
    type : Schema.Types.ObjectId,
    ref: "review"
  }],
  owner:{
    type : Schema.Types.ObjectId,
    ref: "user"
  }
});

listingSchema.post("findOneAndDelete", async function(doc){
  if(doc){
    await reviews.deleteMany({ _id : { $in : doc.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;