const Joi = require('joi');

module.exports.listing = Joi.object({
  listing : Joi.object({
    title : Joi.string().required(),
    descripiton : Joi.string().required(),
    location : Joi.string().required(),
    country : Joi.string().required(),
    price : Joi.number().required().min(0),
    image : Joi.string().allow("", null)
  }).required()
})