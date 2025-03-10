/*
API that allows your frontend to communicate with your backend server (Node.js) for processing and retrieving data.
To access a MySQL database with Node.js and can be use it.
This page is used in report functions which is used to get the report details.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const db = require("../../db_connect/connect");
const dynamic_db = require("../../db_connect/dynamic_connect");
const main = require('../../logger');
require("dotenv").config();
const fs = require('fs');
const { parse: json2csv } = require('json2csv');
const env = process.env
const media_storage = env.MEDIA_STORAGE;

// OtpDeliveryReport - start 
async function OtpDeliveryReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];
    var user_id = req.body.user_id;
    // query parameters
    logger_all.info("[ManualUploadList query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y'`
    if (user_id) {
      get_user = get_user + `and user_id = '${user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));

    if (get_user_id.length == 0) { // If get_user not available send error response to client in ivalid token
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }

    logger_all.info("[USER ID ] : " + user_id);
    if (user_id == 1) {
      const userIdQuery = "SELECT user_id FROM whatsapp_report.user_management";
      const userIds = await db.query(userIdQuery);
      var detail_report = ""
      var userId;
      var array_userid = [];
      // Loop through each user ID
      for (let i = 0; i < userIds.length; i++) {
        array_userid.push(userIds[i].user_id);
      }
      var array_list_userid_string = array_userid.join("','");
      // Construct the SQL query to fetch approval details for the current user ID
      detail_report = detail_report + `SELECT c.campaign_name, c.template_name, c.campaign_id, c.template_id as templateid, c.total_mobileno_count, c.whatsapp_entry_date, u.user_name FROM whatsapp_report.master_compose_whatsapp AS c JOIN whatsapp_report.user_management AS u ON c.user_id = u.user_id WHERE c.whatsapp_status = 'S' and c.user_id in ('${array_list_userid_string}')`;
    }
    else {
      console.log("else");
      detail_report = `SELECT c.campaign_name, c.template_name, c.campaign_id, c.template_id as templateid, c.total_mobileno_count, c.whatsapp_entry_date, u.user_name FROM whatsapp_report.master_compose_whatsapp AS c JOIN whatsapp_report.user_management AS u ON c.user_id = u.user_id WHERE c.whatsapp_status = 'S' and c.user_id = '${user_id}'`;
    }

    detail_report = detail_report + ` ORDER BY whatsapp_entry_date DESC`;

    logger_all.info("[select query request] : " + detail_report);

    const get_report = await db.query(detail_report);
    logger_all.info("[select query response] : " + JSON.stringify(detail_report))

    if (get_report.length == 0) {
      return { response_code: 0, response_status: 201, response_msg: 'No Data available' };
    } else {
      return { response_code: 1, response_status: 200, response_msg: 'Success', num_of_rows: get_report.length, report: get_report };
    }
  }
  catch (e) { // any error occurres send error response to client
    logger_all.info("[OTP DELIVERY REPORT failed response] : " + e)
    return { response_code: 0, response_status: 201, response_msg: 'Error Occurred ' };
  }

}

// OtpDeliveryReport- end
// using for module exporting
module.exports = {
  OtpDeliveryReport,
};
