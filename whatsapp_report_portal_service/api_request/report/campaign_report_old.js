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
const json2csv = require('json2csv');
const env = process.env
const media_storage = env.MEDIA_STORAGE;

// MobileReport - start
async function MobileReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var mobile_number = req.body.mobile_number;
    // declare the variables
    var user_id;
    var get_campaign;
    // Query parameters 
    logger_all.info("[MobileReport query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));

    if (get_user_id.length == 0) { // If get_user not available send error response to client in ivalid token
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else { // otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }
    // to get_campaign name query is continue to executing
    logger_all.info("[select query request] : " + `SELECT cam.compose_whatsapp_id,cam.campaign_name,cam.message_type,cam.total_mobileno_count,sts.mobile_no,sts.comments sender, DATE_FORMAT(sts.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date,sts.response_status,sts.response_message,sts.response_id, DATE_FORMAT(sts.response_date,'%d-%m-%Y %h:%i:%s %p') response_date,sts.delivery_status,sts.read_status, DATE_FORMAT(sts.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(sts.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM compose_whatsapp_status_tmpl_${user_id} sts
        LEFT JOIN compose_whatsapp_tmpl_${user_id} cam ON cam.compose_whatsapp_id = sts.compose_whatsapp_id
        WHERE sts.mobile_no = '${mobile_number}' order by compose_whatsapp_id desc`)
    get_campaign = await dynamic_db.query(`SELECT cam.compose_whatsapp_id,cam.campaign_name,cam.message_type,cam.total_mobileno_count,sts.mobile_no,sts.comments sender, DATE_FORMAT(sts.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date,sts.response_status,sts.response_message,sts.response_id, DATE_FORMAT(sts.response_date,'%d-%m-%Y %h:%i:%s %p') response_date,sts.delivery_status,sts.read_status, DATE_FORMAT(sts.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(sts.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM compose_whatsapp_status_tmpl_${user_id} sts
        LEFT JOIN compose_whatsapp_tmpl_${user_id} cam ON cam.compose_whatsapp_id = sts.compose_whatsapp_id
        WHERE sts.mobile_no = '${mobile_number}' order by compose_whatsapp_id desc`, null, `whatsapp_report_${user_id}`);
    // get_campaign length is '0' to through the no data available message.
    if (get_campaign.length == 0) {
      return { response_code: 1, response_status: 204, response_msg: 'No data available' };
    }
    else {// otherwise to get numbers values.
      return { response_code: 1, response_status: 200, response_msg: 'Success', report: get_campaign };
    }

  }
  catch (e) {// any error occurres send error response to client
    logger_all.info("[MobileReport failed response] : " + e)
    return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
  }
}
// MobileReport- end

// CampaignReport - start
async function CampaignReport(req) {
  try {
    var logger_all = main.logger_all

    const header_token = req.headers['authorization'];

    // get all the req data
    var campaign_name = req.body.campaign_name;
    var mobile_number = req.body.mobile_number ? req.body.mobile_number : [];
    // declare the variables
    var user_id;
    // declare the array
    var getdelivery = [];
    var array_list_user_id = [];
    // To initialize a variable with an empty string value
    var list_user_id = ``;
    var get_delivery_report = '';
    // Query parameters 
    logger_all.info("[Campaign detailed report query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }
    // to get the user ids to act as the parent ids.
    logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    const query = await db.query(` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    logger_all.info("[select query response] : " + JSON.stringify(query))
    // if number of query length  is available then process the will be continued
    // loop all the get the user ids to act as the array_list_user_id.
    if (query.length > 0) {
      for (var i = 0; i < query.length; i++) {
        list_user_id += ", " + query[i].user_id;
        array_list_user_id.push(query[i].user_id);
      }
    }

    if (mobile_number.length != 0) {
      // if number of mobile_number length  is not equal to zero then process the will be continued.
      // loop all the get the mobile_number length and loop with in another loop for array_list_user_id length .
      for (var m = 0; m < mobile_number.length; m++) {
        get_delivery_report = '';

        for (var i = 0; i < array_list_user_id.length; i++) {

          get_delivery_report += ` SELECT wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') AND wht.campaign_name = '${campaign_name}' AND stt.mobile_no = '${mobile_number[m]}' UNION`;
        }
        var lastIndex = get_delivery_report.lastIndexOf(" ");

        get_delivery_report = get_delivery_report.substring(0, lastIndex);

        logger_all.info('[select query request] : ' + get_delivery_report);

        var getdelivery_array = await dynamic_db.query(get_delivery_report, null, `whatsapp_report_${user_id}`);

        if (getdelivery_array.length == 0) { // if the getdelivery_array length is '0' to send the no available data.otherwise it will be return the getdelivery_array details.
          getdelivery.push({ mobile_number: mobile_number[m], reason: "Not available." })
        }
        else {
          getdelivery.push(getdelivery_array[0]);
        }
      }
    }
    else { // otherwise array_list_user_id length for looping for to get get_delivery_report
      for (var i = 0; i < array_list_user_id.length; i++) {
        get_delivery_report += ` SELECT wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') AND wht.campaign_name = '${campaign_name}' UNION`;
      }
      var lastIndex = get_delivery_report.lastIndexOf(" ");
      get_delivery_report = get_delivery_report.substring(0, lastIndex);
      logger_all.info('[select query request] : ' + get_delivery_report);
      var getdelivery_array = await dynamic_db.query(get_delivery_report, null, `whatsapp_report_${user_id}`);
      getdelivery = getdelivery_array;
    }
    // if the get_whatsapp_senderid length is '0' to send the no available data.otherwise it will be return the get_whatsapp_senderid details.
    if (getdelivery.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      return {
        response_code: 1,
        response_status: 200,
        response_msg: 'Success',
        num_of_rows: getdelivery.length,
        report: getdelivery
      };

    }

  } catch (e) { // any error occurres send error response to client
    logger_all.info("[campaign detailed report failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}
// CampaignReport - start
// MessengerResponseList - start
async function MessengerResponseList(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var user_id;
    // declare the variables
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var message_type = req.body.message_type;
    var date_filter = req.body.date_filter;
    // To initialize a variable with an empty string value
    var whrcondition = ` `;
    // query parameters
    logger_all.info("[messenger response query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      bearer_token_1 = get_user_id[0].bearer_token;
      user_id = get_user_id[0].user_id;
    }


    whrcondition = ` and 1 = 1 `;
    if (sender) { //senderid using
      whrcondition = ` and res.message_from = '${sender}' `;
    }
    if (receiver) {//receiver using
      whrcondition = ` and res.message_to = '${receiver}' `;
    }
    if (message_type) { //message type using
      whrcondition = ` and res.message_type = '${message_type}' `;
    }
    if (date_filter) { //date filter using
      var date_filter_1 = date_filter.split("-");
      whrcondition = ` and (date(res.message_rec_date) BETWEEN '${date_filter_1[0]}' and '${date_filter_1[1]}' )   `;
    }

    logger_all.info("[select query request] : " + `SELECT res.message_id, usr.user_id, usr.user_name, res.message_from, res.message_to, res.message_from_profile, res.message_resp_id, res.message_type, res.msg_text, res.msg_media, res.msg_media_type, res.msg_media_caption, res.msg_reply_button, res.msg_reaction, res.message_is_read, res.message_status, res.message_rec_date, res.message_read_date FROM messenger_response res left join user_management usr on usr.user_id = res.user_id where res.message_status = 'Y' and (usr.user_id = '${user_id}' or usr.parent_id = '${user_id}') ${whrcondition} order by res.message_rec_date desc`)
    const get_messenger_response = await db.query(`SELECT res.message_id, usr.user_id, usr.user_name, res.message_from, res.message_to, res.message_from_profile, res.message_resp_id, res.message_type, res.msg_text, res.msg_media, res.msg_media_type, res.msg_media_caption, res.msg_reply_button, res.msg_reaction, res.message_is_read, res.message_status, res.message_rec_date, res.message_read_date FROM messenger_response res left join user_management usr on usr.user_id = res.user_id where res.message_status = 'Y' and (usr.user_id = '${user_id}' or usr.parent_id = '${user_id}') ${whrcondition} order by res.message_rec_date desc`);
    logger_all.info("[select query response] : " + JSON.stringify(get_messenger_response))
    // if the get_messenger_response length is '0' to send the no available data.otherwise it will be return the get_messenger_response details.
    if (get_messenger_response.length == 0) {
      return { response_code: 1, response_status: 204, response_msg: 'No data available' };
    }
    else {
      return { response_code: 1, response_status: 200, num_of_rows: get_messenger_response.length, response_msg: 'Success', report: get_messenger_response };
    }

  }
  catch (e) {// any error occurres send error response to client
    logger_all.info("[messenger response failed response] : " + e)
    return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
  }
}
// MessengerResponseList - end

// CampaignSummaryReport - start
async function CampaignSummaryReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var campaign_name = req.body.campaign_name;
    // declare the variables
    var user_id;
    // declare the array
    var getdelivery = [];
    var array_list_user_id = [];
    // To initialize a variable with an empty string value
    var list_user_id = ``;
    var get_delivery_report = '';
    // Query parameters 
    logger_all.info("[campaign summary report query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else { // otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }
    // to get the user ids to act as the parent ids.
    logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    const query = await db.query(` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    logger_all.info("[select query response] : " + JSON.stringify(query))
    // if number of query length  is available then process the will be continued
    // loop all the get the user ids to act as the array_list_user_id.
    if (query.length > 0) {
      for (var i = 0; i < query.length; i++) {
        list_user_id += ", " + query[i].user_id;
        array_list_user_id.push(query[i].user_id);
      }
      logger_all.info(array_list_user_id);
    }
    // if number of array_list_user_id length is available then process the will be continued
    // loop all the array_list_user_id.

    for (var i = 0; i < array_list_user_id.length; i++) {
      get_delivery_report += ` SELECT wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') AND wht.campaign_name = '${campaign_name}' UNION`;

    }
    var lastIndex = get_delivery_report.lastIndexOf(" ");

    get_delivery_report = get_delivery_report.substring(0, lastIndex);

    logger_all.info('[select query request] : ' + get_delivery_report);

    var getdelivery_array = await dynamic_db.query(get_delivery_report, null, `whatsapp_report_${user_id}`);

    getdelivery = getdelivery_array;
    // if the getdelivery length is '0' to send the no available data.otherwise it will be return the getdelivery details.the process will be continued.
    if (getdelivery.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      // declare the array
      var get_campaign_succ = [];
      var get_campaign_failed = [];
      var get_campaign_delivered = [];
      var get_campaign_read = [];
      // if number of getdelivery length is available then process the will be continued
      // loop all the getdelivery.to push the get_campaign_succ array
      for (var k = 0; k < getdelivery.length; k++) {
        if (getdelivery[k].response_status == 'S') {
          get_campaign_succ.push(1)
        }
        else {// otherwise to push the get_campaign_failed array
          get_campaign_failed.push(1)
        }

        if (getdelivery[k].delivery_status != null) {// if the getdelivery[k].delivery_status is not equal to 'null' use this condition
          get_campaign_delivered.push(1)
        }

        if (getdelivery[k].read_status != null) {// if the getdelivery[k].read_status is not equal to 'null' use this condition
          get_campaign_read.push(1)
        }
      }
      // to return the success message get_delivery_report details
      return { response_code: 1, response_status: 200, response_msg: 'Success', report: { total_count: getdelivery.length, sent_count: get_campaign_succ.length, delivered_count: get_campaign_delivered.length, read_count: get_campaign_read.length, failed_count: get_campaign_failed.length, pending_count: getdelivery.length - (get_campaign_succ.length + get_campaign_failed.length), undelivered_count: get_campaign_succ.length - get_campaign_delivered.length, unread_count: get_campaign_succ.length - get_campaign_read.length } };

    }

  } catch (e) { // any error occurres send error response to client
    logger_all.info("[Campaign summary report failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}
// CampaignSummaryReport - end

// ReportFilterUser - start
/*async function ReportFilterUser(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var user_id, user_master_id, get_repfilteruser_list, prntid = '';
    // Query parameters 
    logger_all.info("[messenger response query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {  // otherwise to get the user details
      user_id = get_user_id[0].user_id;
      user_master_id = get_user_id[0].user_master_id;
    }
    // primary admin - admin are following this to get the parent id
    if (user_master_id == 1 || user_master_id == 2) {
      logger_all.info("[select query request] : " + `SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`)
      const get_parent_id = await db.query(`SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`);
      logger_all.info("[select query response] : " + JSON.stringify(get_parent_id)) // if number of get_parent_id length  is available then process the will be continued
      // loop all the get the user ids to act as the parent ids.
      for (var i = 0; i < get_parent_id.length; i++) {
        prntid += get_parent_id[i].user_id + ',';
      }
      const prntids = prntid.slice(0, -1);

      logger_all.info("[select query request] : " + `SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id in ('${user_id}', '${prntids}')`);
      get_repfilteruser_list = await db.query(`SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id in ('${user_id}', '${prntids}')`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list))//if the usermasterid is '3' to get the execute the this condition. the userid will act as a parentid.
    } else if (user_master_id == 3) {
      logger_all.info("[select query request] : " + `SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id = '${user_id}'`);
      get_repfilteruser_list = await db.query(`SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id = '${user_id}'`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list))
    } else {  //otherwise to execute the this condition
      logger_all.info("[select query request] : " + `SELECT user_name, user_id FROM user_management where user_id = '${user_id}'`);
      get_repfilteruser_list = await db.query(`SELECT user_name, user_id FROM user_management where user_id = '${user_id}'`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list))
    }
    // if the get_repfilteruser_list length is '0' to send the no available data.otherwise it will be return the get_repfilteruser_list details.
    if (get_repfilteruser_list.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      return {
        response_code: 1,
        response_status: 200,
        num_of_rows: get_repfilteruser_list.length,
        response_msg: 'Success',
        report: get_repfilteruser_list
      };
    }

  } catch (e) {// any error occurres send error response to client
    logger_all.info("[messenger response failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}*/
async function ReportFilterUser(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var user_id, get_repfilteruser_list;
    // Query parameters 
    logger_all.info("[ReportFilterUser] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {  // otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }
    // primary admin - admin are following this to get the parent id
    if (user_id == 1) {
      logger_all.info("[select query request] : " + `SELECT user_id,user_name FROM user_management where user_master_id = '2' ORDER BY user_id ASC`)
      get_repfilteruser_list = await db.query(`SELECT user_id,user_name FROM user_management where user_master_id = '2' ORDER BY user_id ASC`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list)) // if number of get_parent_id length  is available then process the will be continued
    } else if (user_id == 2) {
      logger_all.info("[select query request] : " + `SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id = '${user_id}'`);
      get_repfilteruser_list = await db.query(`SELECT user_name, user_id FROM user_management where user_id = '${user_id}' or parent_id = '${user_id}'`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list))
    } else {  //otherwise to execute the this condition
      logger_all.info("[select query request] : " + `SELECT user_name, user_id FROM user_management where user_id = '${user_id}'`);
      get_repfilteruser_list = await db.query(`SELECT user_name, user_id FROM user_management where user_id = '${user_id}'`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilteruser_list))
    }
    console.log(get_repfilteruser_list.length+"**********");
    // if the get_repfilteruser_list length is '0' to send the no available data.otherwise it will be return the get_repfilteruser_list details.
    if (get_repfilteruser_list.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      return {
        response_code: 1,
        response_status: 200,
        num_of_rows: get_repfilteruser_list.length,
        response_msg: 'Success',
        report: get_repfilteruser_list
      };
    }

  } catch (e) {// any error occurres send error response to client
    logger_all.info("[ReportFilterUser] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}
// ReportFilterUser - end
// ReportFilterDepartment -start
/*async function ReportFilterDepartment(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
    var user_id, user_master_id, get_repfilterdepartment_list, prntid = '';
    // query parameters
    logger_all.info("[messenger response query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      user_id = get_user_id[0].user_id;
      user_master_id = get_user_id[0].user_master_id;
    }

    // if the user_master_id is equal to '1' to execute the condition
    if (user_master_id == 1) {
      logger_all.info("[select query request] : " + `SELECT user_master_id, user_type FROM user_master where user_master_id in (2, 3, 4)`);
      get_repfilterdepartment_list = await db.query(`SELECT user_master_id, user_type FROM user_master where user_master_id in (2, 3, 4)`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
    } else if (user_master_id == 2) {// if the user_master_id is equal to '2' to execute the condition
      logger_all.info("[select query request] : " + `SELECT user_master_id, user_type FROM user_master where user_master_id in (3, 4)`);
      get_repfilterdepartment_list = await db.query(`SELECT user_master_id, user_type FROM user_master where user_master_id in (3, 4)`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
    } else {//otherwise to execute the condition
      logger_all.info("[select query request] : " + `SELECT user_master_id, user_type FROM user_master where user_master_id in (4)`);
      get_repfilterdepartment_list = await db.query(`SELECT user_master_id, user_type FROM user_master where user_master_id in (4)`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
    }
    // if the get_repfilterdepartment_list length is '0' to send the no available data.otherwise it will be return the get_repfilterdepartment_list details.
    if (get_repfilterdepartment_list.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      return {
        response_code: 1,
        response_status: 200,
        num_of_rows: get_repfilterdepartment_list.length,
        response_msg: 'Success',
        report: get_repfilterdepartment_list
      };
    }

  } catch (e) {// any error occurres send error response to client
    logger_all.info("[messenger response failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}*/
async function ReportFilterDepartment(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get all the req data
   var user_master_id = req.body.admin_user_id
   var user_id = req.body.user_id
    var get_repfilterdepartment_list;
    // query parameters
    logger_all.info("[ReportFilterDepartment] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    // if the user_master_id is equal to '1' to execute the condition
    if(user_id == 1 || user_id == 2){
      if (user_master_id == 2) {
        logger_all.info("[select query request] : " + `SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
        get_repfilterdepartment_list = await db.query(`SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
        logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
      }
    }
    if(user_master_id == 3){
      logger_all.info("[select query request] : " + `SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
      get_repfilterdepartment_list = await db.query(`SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
    }
    else if(user_master_id == 6){
      logger_all.info("[select query request] : " + `SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
      get_repfilterdepartment_list = await db.query(`SELECT user_id, user_name FROM user_management where parent_id in ('${user_master_id}')`);
      logger_all.info("[select query response] : " + JSON.stringify(get_repfilterdepartment_list))
    }
 
    // if the get_repfilterdepartment_list length is '0' to send the no available data.otherwise it will be return the get_repfilterdepartment_list details.
    if (get_repfilterdepartment_list.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {
      return {
        response_code: 1,
        response_status: 200,
        num_of_rows: get_repfilterdepartment_list.length,
        response_msg: 'Success',
        report: get_repfilterdepartment_list
      };
    }

  } catch (e) {// any error occurres send error response to client
    logger_all.info("[ReportFilterDepartment] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}
async function OtpSummaryReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get current Date and time
    var day = new Date();
   // var today_date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
 var today_date =  day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()  ;
    // get all the req filter data
    var filter_date = req.body.filter_date;
    var store_id_filter = req.body.store_id_filter;
    var filter_user = req.body.filter_user;
    var filter_department = req.body.filter_department;
    // declare the variables
    var prntid;
    var user_id;
    var user_master_id;
    var available_messages;
    var user_name;
    var newdb;
    var prntid_1;
    var list_user_id_1;
    var list_user_id;
    var this_date = today_date;
    var getsummary;
    var newdb;
    var get_summary_report;
    var filter_date_1;
    var filter_date_first;
    var filter_date_second;
    var query_1;
    // To initialize a variable with an empty string value
    var list_user_id = '';
    // declare the array
    var array_list_user_id = [];
    var total_response = [];
    var array_summary = [];
    var total_available_messages = [];
    var total_user_id = [];
    var total_user_master_id = [];
    var total_user_name = [];
    // Query parameters 
    logger_all.info("[Otp summary report query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));

    if (get_user_id.length == 0) { // If get_user not available send error response to client in ivalid token
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      user_id = get_user_id[0].user_id;
      user_master_id = get_user_id[0].user_master_id;
    }

    // To initialize a variable with an empty string value
    var prnt_id = ` `;
    prntid = ` `;
    whrcondition = ` `;
    get_summary_report = ``;
    // if the user_master_id value is '1' or user_master_id value is '2' to the process will be continued.
        // filter_user or filter_department using
    if (filter_user && filter_department) {
      user_id = filter_department;
      var query_1 = `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}' or usr.parent_id in (${user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`;
      logger_all.info(query_1);
    } else if (filter_user){
      user_id = filter_user;
      var query_1 = `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}' or usr.parent_id in (${user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`;
      logger_all.info(query_1);
    }
   else{
 if(filter_department){
      user_id = filter_department;
    }
    // to get the user ids to act as the parent ids.
    var query_1 = `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}' or usr.parent_id in (${user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`;
    logger_all.info(query_1);
    }
    // if number of sql_query_4 length  is available then process the will be continued
    // loop all the get the user id to push the total_available_messages, the total_user_id,total_user_master_id,total_user_name array
    var sql_query_4 = await db.query(query_1);
    for (var i = 0; i < sql_query_4.length; i++) {
      total_available_messages.push(sql_query_4[i].available_messages);
      total_user_id.push(sql_query_4[i].user_id);
      total_user_master_id.push(sql_query_4[i].user_master_id);
      total_user_name.push(sql_query_4[i].user_name);
    }
    // to get the select query
    logger_all.info(` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id in ('${user_id}'${prnt_id}))${whrcondition} `);
    var select_query = await db.query(` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id in ('${user_id}' '${prnt_id}'))${whrcondition} `);

    logger_all.info("[select query response] : " + JSON.stringify(select_query))
    // if number of select_query length  is available then process the will be continued
    // loop all the get the user id to push the list_user_id, the array_list_user_id array
    if (select_query.length > 0) {
      for (var i = 0; i < select_query.length; i++) {

        list_user_id += "," + select_query[i].user_id;
        array_list_user_id.push(select_query[i].user_id);
      }
      list_user_id_1 = list_user_id.trimStart(',');
      list_user_id = list_user_id_1.substring(1);
      // loop for array_list_user_id length 
      for (var i = 0; i < array_list_user_id.length; i++) {
        newdb = "whatsapp_report_" + array_list_user_id[i];

        if (store_id_filter) { //store_id filter using
          get_summary_report = `  SELECT wht.user_id,wht.store_id, usr.user_name,ussr.user_type,wht.whatsapp_entry_date,ml.available_messages, DATE_FORMAT(wht.whatsapp_entry_date,'%d-%m-%Y') entry_date, wht.total_mobileno_count total_msg,wht. total_mobileno_count total_waiting, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'S') total_success, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'S' and delivery_status = 'Y') total_delivered, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND'${this_date}') and response_status = 'S' and read_status = 'Y') total_read, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'F') total_failed, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND'${this_date}') and response_status = 'I') total_invalid, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and (response_status not in ('I', 'F', 'S') or response_status is null)) total_waitinggg FROM ${newdb}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id left join whatsapp_report.message_limit ml on wht.user_id = ml.user_id left join whatsapp_report.user_master ussr on usr.user_master_id = ussr.user_master_id where usr.user_id = '${array_list_user_id[i]}' and (date(wht.whatsapp_entry_date) BETWEEN '${this_date}' AND '${this_date}') and wht.store_id = '${store_id_filter}' order by entry_date desc `;
          logger_all.info('[Select Query Request]' + get_summary_report);
          getsummary = await dynamic_db.query(get_summary_report, null, `whatsapp_report_${user_id}`);
          // if the getsummary length is not available to push the my obj datas.otherwise it will be return the push the getsummary details.
 if (getsummary.length == 0) {
            var myObj = {
              "user_id": total_user_id[i],
              "store_id": null,
              "user_type": total_user_name[i],
              "available_messages": total_available_messages[i],
              "entry_date": today_date,
              "user_name": total_user_name[i],
              "user_master_id": total_user_master_id[i],
              "total_msg": 0,
              "total_success": 0,
              "total_failed": 0,
              "total_invalid": 0,
              "total_waiting": 0,
              "total_delivered": 0,
              "total_read": 0
            }
            total_response.push(myObj);
          } else { //otherwise push getsummary details
            total_response.push(getsummary[0]);

          }
          logger_all.info("[select query response] : " + JSON.stringify(getsummary))
        }
        // if the filter_date is empty and store_id_filter is empty to execute the this condition
  if (!filter_date && !store_id_filter) {
          get_summary_report += ` SELECT wht.user_id,wht.store_id, usr.user_name,ussr.user_type,wht.whatsapp_entry_date,ml.available_messages, DATE_FORMAT(wht.whatsapp_entry_date,'%d-%m-%Y') entry_date, wht.total_mobileno_count total_msg,wht. total_mobileno_count total_waiting, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'S') total_success, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'S' and delivery_status = 'Y') total_delivered, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND'${this_date}') and response_status = 'S' and read_status = 'Y') total_read, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and response_status = 'F') total_failed, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND'${this_date}') and response_status = 'I') total_invalid, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${this_date}' AND '${this_date}') and (response_status not in ('I', 'F', 'S') or response_status is null)) total_waitinggg FROM ${newdb}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id left join whatsapp_report.message_limit ml on wht.user_id = ml.user_id left join whatsapp_report.user_master ussr on usr.user_master_id = ussr.user_master_id where usr.user_id = '${array_list_user_id[i]}' and (date(wht.whatsapp_entry_date) BETWEEN '${this_date}' AND '${this_date}') union`;
        }

        // date filter are using to execute the condition 
        if (filter_date) {
          // date function for looping in one by one date
          filter_date_1 = filter_date.split("-");
          filter_date_first = Date.parse(filter_date_1[0]);
          filter_date_second = Date.parse(filter_date_1[1]);
          function dateRange(startDate, endDate, steps = 1) {
            const dateArray = [];
            let currentDate = new Date(startDate);

            while (currentDate <= new Date(endDate)) {
              dateArray.push(new Date(currentDate));

              function convert(dates) {
                var date = new Date(dates),
                  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                  day = ("0" + date.getDate()).slice(-2);
                return [date.getFullYear(), mnth, day].join("-");
              }
              slt_date = convert(currentDate);

              //get_summary_report += ` SELECT wht.user_id,wht.store_id, usr.user_name,ussr.user_type,wht.whatsapp_entry_date,ml.available_messages,DATE_FORMAT(wht.whatsapp_entry_date,'%d-%m-%Y') entry_date,wht.total_mobileno_count total_msg,wht. total_mobileno_count total_waiting, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and response_status = 'S') total_success, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and response_status = 'S' and delivery_status = 'Y') total_delivered, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and response_status = 'S' and read_status = 'Y') total_read, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and response_status = 'F') total_failed, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and response_status = 'I') total_invalid, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') and (response_status not in ('I', 'F', 'S') or response_status is null)) total_waitingggg FROM ${newdb}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id left join whatsapp_report.message_limit ml on wht.user_id = ml.user_id left join whatsapp_report.user_master ussr on usr.user_master_id = ussr.user_master_id where usr.user_id = '${array_list_user_id[i]}' and (date(wht.whatsapp_entry_date) BETWEEN '${slt_date}' AND '${slt_date}') union`;
              		get_summary_report += ` SELECT wht.user_id, wht.store_id,wht.campaign_name, wht.campaign_id, usr.user_name, ussr.user_type,wht.whatsapp_entry_date, ml.available_messages, DATE_FORMAT(wht.whatsapp_entry_date,'%d-%m-%Y') AS entry_date, wht.total_mobileno_count AS total_msg, COUNT(DISTINCT CASE WHEN stt.delivery_status = 'SENT' THEN stt.comwtap_status_id END) AS total_success,COUNT(DISTINCT CASE WHEN stt.delivery_status = 'DELIVERED' THEN stt.comwtap_status_id END) AS total_delivered, COUNT(DISTINCT CASE WHEN stt.delivery_status = 'READ' THEN stt.comwtap_status_id END) AS total_read,COUNT(DISTINCT CASE WHEN stt.delivery_status IN ('BLOCKED', 'INCAPABLE', 'NOT AVAILABLE', 'FAILED') THEN stt.comwtap_status_id END) AS total_failed, COUNT(DISTINCT CASE WHEN stt.delivery_status = 'INVALID' THEN stt.comwtap_status_id END) AS total_invalid, COUNT(DISTINCT CASE WHEN stt.delivery_status NOT IN ('INVALID', 'SENT', 'FAILED', 'BLOCKED', 'INCAPABLE', 'NOT AVAILABLE', 'READ', 'DELIVERED') OR stt.delivery_status IS NULL THEN stt.comwtap_status_id END) AS total_waiting FROM  ${newdb}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht LEFT JOIN ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt ON wht.compose_whatsapp_id = stt.compose_whatsapp_id LEFT JOIN whatsapp_report.user_management usr ON wht.user_id = usr.user_id LEFT JOIN whatsapp_report.message_limit ml ON wht.user_id = ml.user_id LEFT JOIN  whatsapp_report.user_master ussr ON usr.user_master_id = ussr.user_master_id WHERE usr.user_id = '${array_list_user_id[i]}' and DATE(stt.comwtap_entry_date) BETWEEN '${slt_date}' AND '${slt_date}' Group By wht.campaign_name union`; 
              currentDate.setUTCDate(currentDate.getUTCDate() + steps);
            }

            return dateArray;
          }

          const dates = dateRange(filter_date_1[0], filter_date_1[1]);
        }


      }//filter date condition
      if (!store_id_filter) {

        var lastIndex = get_summary_report.lastIndexOf(" ");

        get_summary_report = get_summary_report.substring(0, lastIndex);


        logger_all.info('[select query request] : ' + get_summary_report + ` order by whatsapp_entry_date desc `);

        getsummary = await dynamic_db.query(get_summary_report + ` order by whatsapp_entry_date desc `, null, `whatsapp_report_${user_id}`);
   }
      // getsummary length is '0'.to send the Success message and to send the total_response datas.

   for (var i = 0; i < array_list_user_id.length; i++) {
        if (getsummary.length == 0) {
          var myObj = {
            "user_id": total_user_id[i],
            "store_id": null,
            "user_type": total_user_name[i],
            "available_messages": total_available_messages[i],
            "entry_date": today_date,
            "user_name": total_user_name[i],
            "user_master_id": total_user_master_id[i],
            "campaign_name": "-",
            "campaign_id": "-",
            "total_msg": 0,
            "total_success": 0,
            "total_failed": 0,
            "total_invalid": 0,
            "total_waiting": 0,
            "total_delivered": 0,
            "total_read": 0
          }
          total_response.push(myObj);
        }
      }
      if (getsummary == 0) {
        return {
          response_code: 1, response_status: 200, response_msg: 'Success', report: total_response
        };
      }
      else { //otherwise to send the success message and get summarydetails
        return {
          response_code: 1, response_status: 200, response_msg: 'Success', report: getsummary
        };

      }
    }

  }
  catch (e) {// any error occurres send error response to client
    logger_all.info("[Otp summary report failed response] : " + e)
    return {
      response_code: 0, response_status: 201, response_msg: 'Error occured'
    };
  }

}
// otpsummary report - end
// OtpDeliveryReport - start
/*async function OtpDeliveryReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get current Date and time
    var day = new Date();
    var today_date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
    // get all the req filter data
    // var campaign_id = req.body.campaign_id;
var user_id  = req.body.user_id;
    var sender_filter = req.body.sender_filter;
    var store_id_filter = req.body.store_id_filter;
    var receiver_filter = req.body.receiver_filter;
    var status_filter = req.body.status_filter;
    var delivery_filter = req.body.delivery_filter;
    var read_filter = req.body.read_filter;
    var response_date_filter = req.body.response_date_filter;
    var delivery_date_filter = req.body.delivery_date_filter;
    var read_date_filter = req.body.read_date_filter;
    var filter_user = req.body.filter_user;
    var filter_department = req.body.filter_department;
    // declare the variables
    var getdelivery;
    var store_id_filter;
    var get_delivery_report;
    var filter;
    // var this_date = today_date;
    // var getsummary;
    // declare the array
    var array_list_user_id = [];
    // To initialize a variable with an empty string value
    filter = ``;
    list_user_id = ``;
    // query parameters
    logger_all.info("[OtpDeliveryReport query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }

    if (store_id_filter) { //store_id_filter using
      filter = ` and wht.store_id = '${store_id_filter}' `;
    }
    if (sender_filter) { // sender_filter using
      filter = ` and stt.comments LIKE '%${sender_filter}%' `;
    }
    if (receiver_filter) { //receiver_filter using
      filter = ` and stt.mobile_no LIKE '%${receiver_filter}%' `;
    }
    // status_filter condition using
    if (status_filter) {
      switch (status_filter != '') {
        case (status_filter.toLowerCase() == 'sent'):
          filter = ` and stt.response_status = 'S' `;
          break;
        case (status_filter.toLowerCase() == 'failed'):
          filter = ` and stt.response_status = 'F' `;
          break;
        case (status_filter.toLowerCase() == 'invalid'):
          filter = ` and stt.response_status = 'I' `;
          break;
        case (status_filter.toLowerCase() == 'yet to send'):
          filter = ` and stt.response_status is NULL `;
          break;
        default:
          filter = ` and stt.response_status = 'G' `;
          break;
      }
    }
    // delivery_filter using
    if (delivery_filter) {
      switch (delivery_filter != '') {
        case (delivery_filter.toLowerCase() == 'delivered'):
          filter = ` and stt.delivery_status = 'Y' `;
          break;
        case (delivery_filter.toLowerCase() == 'not delivered'):
          filter = ` and stt.delivery_status is NULL `;
          break;
        default:
          filter = ` and stt.delivery_status = 'G' `;
          break;
      }
    }
    // read_filter using
    if (read_filter) {
      switch (read_filter != '') {
        case (read_filter.toLowerCase() == 'read'):
          filter = ` and stt.read_status = 'Y' `;
          break;
        case (read_filter.toLowerCase() == 'not read'):
          filter = ` and stt.read_status is NULL `;
          break;
        default:
          filter = ` and stt.read_status = 'G' `;
          break;
      }

    }
    // query parameters
    logger_all.info("[Otp Delivery report query parameters] : " + JSON.stringify(req.body));

    // To initialize a variable with an empty string value
    prnt_id = ` `;
    prntid = ` `;
    whrcondition = ` `;
    get_delivery_report = ``;
    // filter_user or filter_department using
    if (filter_user || filter_department) {
      user_id = filter_user || filter_department;
    }
    // to get the user ids to act as the parent ids.
    logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    const query = await db.query(` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
    logger_all.info("[select query response] : " + JSON.stringify(query))
    // if number of query length  is available then process the will be continued
    // loop all the get the user ids to push the array in  list_user_id,array_list_user_id.
    if (query.length > 0) {
      for (var i = 0; i < query.length; i++) {
        list_user_id += ", " + query[i].user_id;
        array_list_user_id.push(query[i].user_id);
      }
    }
    // if the request response_date_filter is using the condition will be apply
    if (response_date_filter || status_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = response_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing
          for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id,wht.whatsapp_content, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.response_date) BETWEEN '${slt_date}' and '${slt_date}') ${filter} UNION`;

          }

          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;

      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    // if the request delivery_date_filter is using the condition will be apply
    else if (delivery_date_filter || status_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = delivery_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing
          for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id, usr.user_name,wht.store_id,wht.whatsapp_content, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.delivery_date) BETWEEN '${slt_date}' and '${slt_date}')  ${filter} UNION`;

          }

          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    // if the request read_date_filter is using the condition will be apply
    else if (read_date_filter || status_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = read_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing
          for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id, usr.user_name,wht.store_id, wht.campaign_name,wht.whatsapp_content, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.read_date) BETWEEN '${slt_date}' and '${slt_date}') ${filter} UNION`;

          }

          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    else { // otherwise else condition to be processing  // if the array_list_user_id length is lessthen '0' to using the for loop are processing
      for (var i = 0; i < array_list_user_id.length; i++) {
        get_delivery_report += ` SELECT wht.compose_whatsapp_id, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type,wht.whatsapp_content,  wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') ${filter}  UNION`;

      }

    }

    var lastIndex = get_delivery_report.lastIndexOf(" ");
    get_delivery_report = get_delivery_report.substring(0, lastIndex);
    logger_all.info('[select query request] : ' + get_delivery_report + ` order by response_date desc`);
    getdelivery = await dynamic_db.query(get_delivery_report + ` order by response_date desc`, null, `whatsapp_report_${user_id}`);
    //logger_all.info("[select query response] : " + JSON.stringify(getdelivery))
    //  if the getdelivery length is '0'.to send the no data available.
    if (getdelivery.length == 0) {
      return {
        response_code: 1,
        response_status: 204,
        response_msg: 'No data available'
      };
    } else {//otherwise to send the getdelivery details
      return {
        response_code: 1,
        response_status: 200,
        response_msg: 'Success',
        num_of_rows: getdelivery.length,
        report: getdelivery
      };

    }

  } catch (e) { // any error occurres send error response to client
    logger_all.info("[Otp delivery report failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }

}*/
async function OtpDeliveryReport(req) {
  try {
    var logger_all = main.logger_all
    //  Get all the req header data
    const header_token = req.headers['authorization'];

    // get current Date and time
    var day = new Date();
    var today_date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
    // get all the req filter data
    // var campaign_id = req.body.campaign_id;
var user_id  = req.body.user_id;
    var sender_filter = req.body.sender_filter;
    var store_id_filter = req.body.store_id_filter;
    var receiver_filter = req.body.receiver_filter;
    var status_filter = req.body.status_filter;
    var delivery_filter = req.body.delivery_filter;
    var read_filter = req.body.read_filter;
    var response_date_filter = req.body.response_date_filter;
    var delivery_date_filter = req.body.delivery_date_filter;
    var read_date_filter = req.body.read_date_filter;
    var filter_user = req.body.filter_user;
    var filter_department = req.body.filter_department;
    // declare the variables
    var getdelivery;
    var store_id_filter;
    var get_delivery_report;
    var filter;
    var query_1;

    var day = new Date();
    var today_date = day.getFullYear() + '' + (day.getMonth() + 1) + '' + day.getDate();
    var today_time = day.getHours() + "" + day.getMinutes() + "" + day.getSeconds();
    var current_date = today_date + '_' + today_time;

    // var this_date = today_date;
    // var getsummary;
    // declare the array
    var array_list_user_id = [];
    // To initialize a variable with an empty string value
    filter = ``;
    list_user_id = ``;
    // query parameters
    logger_all.info("[OtpDeliveryReport query parameters] : " + JSON.stringify(req.body));
    // To get the User_id
    var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
    if (req.body.user_id) {
      get_user = get_user + `and user_id = '${req.body.user_id}' `;
    }
    logger_all.info("[select query request] : " + get_user);
    const get_user_id = await db.query(get_user);
    logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
    // If get_user not available send error response to client in ivalid token
    if (get_user_id.length == 0) {
      logger_all.info("Invalid Token")
      return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
    }
    else {// otherwise to get the user details
      user_id = get_user_id[0].user_id;
    }

  
    // query parameters
    logger_all.info("[Otp Delivery report query parameters] : " + JSON.stringify(req.body));

    // To initialize a variable with an empty string value
    prnt_id = ` `;
    prntid = ` `;
    whrcondition = ` `;
    get_delivery_report = ``;
    // filter_user or filter_department using
    if (filter_user && filter_department) {
      user_id = filter_department;
      logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
     query_1 = ` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `;
      // user_id = filter_user || filter_department;
    } else if (filter_user){
      user_id = filter_user;
      logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
     query_1 = ` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `;
    }
    else{
   if(filter_department){
        user_id = filter_department;
      }
    // to get the user ids to act as the parent ids.
    logger_all.info(`SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `);
     query_1 = ` SELECT user_id FROM user_management where (user_id = '${user_id}' or parent_id = '${user_id}') `;
    }

  var query = await db.query(query_1 );
    logger_all.info("[select query response] : " + JSON.stringify(query))
    // if number of query length  is available then process the will be continued
    // loop all the get the user ids to push the array in  list_user_id,array_list_user_id.
    if (query.length > 0) {
      for (var i = 0; i < query.length; i++) {
        list_user_id += ", " + query[i].user_id;
        array_list_user_id.push(query[i].user_id);
      }
    }

    // if the request response_date_filter is using the condition will be apply
    if (response_date_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = response_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing
          for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id,wht.whatsapp_content, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id,stt.response_date, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_dates, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.response_date) BETWEEN '${slt_date}' and '${slt_date}') ${filter} UNION`;

          }

          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    // if the request delivery_date_filter is using the condition will be apply
    else if (delivery_date_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = delivery_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing
          for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id,wht.whatsapp_content, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_dates,stt.response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.delivery_date) BETWEEN '${slt_date}' and '${slt_date}') ${filter} UNION`;

          }

          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    // if the request read_date_filter is using the condition will be apply
    else if (read_date_filter) {
      // date funtion for loop the date by one by one
      filter_date_1 = read_date_filter.split("-");
      filter_date_first = Date.parse(filter_date_1[0]);
      filter_date_second = Date.parse(filter_date_1[1]);
      function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));

          function convert(dates) {
            var date = new Date(dates),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
          }
          slt_date = convert(currentDate);
          // if the array_list_user_id length is lessthen '0' to using the for loop are processing

           for (var i = 0; i < array_list_user_id.length; i++) {

            get_delivery_report += ` SELECT wht.compose_whatsapp_id,wht.whatsapp_content,wht.campaign_id,tmp.templateid, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_dates,stt.response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id 
            left join whatsapp_report.message_template tmp on tmp.unique_template_id = wht.unique_template_id
            where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') and (date(stt.read_date) BETWEEN '${slt_date}' and '${slt_date}') ${filter} UNION`;

          }
          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
        return dateArray;
      }
      const dates = dateRange(filter_date_1[0], filter_date_1[1]);
    }
    else { // otherwise else condition to be processing  // if the array_list_user_id length is lessthen '0' to using the for loop are processing

 for (var i = 0; i < array_list_user_id.length; i++) {
        get_delivery_report += ` SELECT wht.compose_whatsapp_id,wht.campaign_id,tmp.templateid,wht.whatsapp_content, usr.user_name,wht.store_id, wht.campaign_name, wht.message_type, wht.total_mobileno_count, stt.mobile_no, stt.comments sender, DATE_FORMAT(stt.comwtap_entry_date,'%d-%m-%Y %h:%i:%s %p') comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, DATE_FORMAT(stt.response_date,'%d-%m-%Y %h:%i:%s %p') response_dates,stt.response_date, stt.delivery_status, stt.read_status, DATE_FORMAT(stt.delivery_date,'%d-%m-%Y %h:%i:%s %p') delivery_date, DATE_FORMAT(stt.read_date,'%d-%m-%Y %h:%i:%s %p') read_date FROM whatsapp_report_${array_list_user_id[i]}.	compose_whatsapp_tmpl_${array_list_user_id[i]} wht
         left join whatsapp_report_${array_list_user_id[i]}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id 
         left join whatsapp_report.user_management usr on wht.user_id = usr.user_id
         left join whatsapp_report.message_template tmp on tmp.unique_template_id = wht.unique_template_id
         
         where (wht.user_id = '${array_list_user_id[i]}' or usr.parent_id = '${array_list_user_id[i]}') ${filter}  UNION`;

      }

    }

    var lastIndex = get_delivery_report.lastIndexOf(" ");
    get_delivery_report = get_delivery_report.substring(0, lastIndex);
    logger_all.info('[select query request] : ' + get_delivery_report + ` order by response_date desc`);
    getdelivery = await dynamic_db.query(get_delivery_report + ` order by response_date desc`, null, `whatsapp_report_${user_id}`);

    if (getdelivery.length > 10000) {
   
 const csvData = getdelivery.map(row => ({
        "Entry date": row.comwtap_entry_date,
        "User name": row.user_name,
        "Campaign name": row.campaign_name.trim(), // Remove trailing newline characters
        "Campaign id": row.campaign_id,
        "Template id": row.templateid,
        "Mobile_no": row.mobile_no,
        "Delivery date": row.delivery_date , // Replace null values with "N/A"
        "Delivery Status": row.delivery_status , // Replace null values with "N/A"

    }));
    

      const csv = json2csv.parse(csvData, { header: true });
      console.log('CSV Data:', csv);  // Log CSV data to check if it's a valid string
      fs.writeFileSync(`${media_storage}/uploads/detailed_report_csv/detailed_report_${current_date}.csv`, csv);
      logger_all.info("[SUCCESS API RESPONSE] " + 'CSV file has been saved successfully.');
      logger_all.info("[SUCCESS API RESPONSE] " + JSON.stringify({ response_code: 1, response_status: 200, response_msg: 'Success ', file_location: `uploads/detailed_report_csv/detailed_report_${current_date}.csv` }))
      //send success response
      return { response_code: 1, response_status: 200, response_msg: 'Success ', num_of_rows: getdelivery.length, file_location: `uploads/detailed_report_csv/detailed_report_${current_date}.csv` };

  } else {
      //check if select campaign length is equal to zero, send error response as 'No data available'
      if (getdelivery[0].length === 0) {
        logger_all.info("[Failed response - No data available] : " + JSON.stringify({
              response_code: 0,
              response_status: 204,
              response_msg: 'No data available.'
          }))
          return {
              response_code: 0,
              response_status: 204,
              response_msg: 'No data available.'
          };
      } else {
          //Otherwise send success response with campaign report data
          logger_all.info("[API SUCCESS RESPONSE] : " + JSON.stringify({
              response_code: 1,
              response_status: 200,
              response_msg: 'Success',
              num_of_rows: getdelivery[0].length,
              report: getdelivery[0]
          }))
          return {
              response_code: 1,
              response_status: 200,
              response_msg: 'Success',
              num_of_rows: getdelivery[0].length,
              report: getdelivery[0]
          };
      }
  }

    //logger_all.info("[select query response] : " + JSON.stringify(getdelivery))
    //  if the getdelivery length is '0'.to send the no data available.
    // if (getdelivery.length == 0) {
    //   return {
    //     response_code: 1,
    //     response_status: 204,
    //     response_msg: 'No data available'
    //   };
    // } else {//otherwise to send the getdelivery details
    //   return {
    //     response_code: 1,
    //     response_status: 200,
    //     response_msg: 'Success',
    //     num_of_rows: getdelivery.length,
    //     report: getdelivery
    //   };

    // }

  } catch (e) { // any error occurres send error response to client
    logger_all.info("[Otp delivery report failed response] : " + e)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }

}

// OtpDeliveryReport- end
// using for module exporting
module.exports = {
  CampaignReport,
  CampaignSummaryReport,
  MessengerResponseList,
  OtpSummaryReport,
  OtpDeliveryReport,
  ReportFilterUser,
  ReportFilterDepartment,
  MobileReport
};

