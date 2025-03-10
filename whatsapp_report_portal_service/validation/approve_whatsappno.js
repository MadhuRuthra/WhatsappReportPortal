/*
It is used to one of which is user input validation.
approve_whatsappnoList function to validate the user.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const Joi = require("@hapi/joi");
// To declare approve_whatsappnoList object 
const approve_whatsappnoList = Joi.object().keys({
  // Object Properties are define
  user_id: Joi.string().optional().label("User Id"),
  whatspp_config_status: Joi.string().required().label("Whatspp Config Status"),
  whatspp_config_id: Joi.string().required().label("Whatsapp Config Id"),
}).options({ abortEarly: false });
// To exports the approve_whatsappnoList module
module.exports = approve_whatsappnoList


