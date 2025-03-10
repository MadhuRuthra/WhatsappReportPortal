/*
It is used to one of which is user input validation.
SendMessage function to validate the user.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const Joi = require("@hapi/joi");
// To declare SendMessage object
const SendMessage = Joi.object().keys({
  // Object Properties are define  
  request_id: Joi.string().required().label("Request ID"),
  user_id: Joi.string().optional().label("User Id"),
  store_id: Joi.string().optional().label("Store Id"),
  sender_numbers: Joi.array().optional().label("Sender Numbers"),
  total_mobileno_count: Joi.string().required().label("total_mobileno_count"),
  receiver_numbers: Joi.array().optional().label("Receiver Numbers"),
  components: Joi.array().optional().label("Components"),
  template_name: Joi.string().required().label("Template Name"),
  template_id: Joi.string().required().label("Template Id"),
  message_type: Joi.string().optional().label("Message Type"),
  variable_values: Joi.array().optional(),
  file_location: Joi.string().optional().label("File Location"),
  link: Joi.string().optional().label("link"),
}).options({ abortEarly: false });
// To exports the SendMessage module
module.exports = SendMessage
