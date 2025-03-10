const Joi = require("@hapi/joi");

const ReportGener = Joi.object().keys({
  database: Joi.string().required().label("Database"),
  table_name: Joi.string().required().label("Table Name"),
  compose_whatsapp_id: Joi.string().required().label("Compose Whatsapp Id"),
  report_group: Joi.string().required().label("Report Group"),
  compose_user: Joi.string().required().label("User ID"),
}).options({abortEarly : false});

module.exports = ReportGener
