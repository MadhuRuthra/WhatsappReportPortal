/*
This api has chat API functions which is used to connect the mobile chat.
This page is act as a Backend page which is connect with Node JS API and PHP Frontend.
It will collect the form details and send it to API.
After get the response from API, send it back to Frontend.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const db = require("../../db_connect/connect");
require("dotenv").config();
const main = require('../../logger');
// WhatsappList function - start
async function WhatsappList(req) {
	var logger_all = main.logger_all
    var logger = main.logger
	try {
			//  Get all the req header data
			const header_token = req.headers['authorization'];

		// get all the req data
		var user_id;

		logger_all.info("[whatsapp_list query parameters] : " + JSON.stringify(req.body));
		var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
        if(req.body.user_id){
            get_user = get_user + `and user_id = '${req.body.user_id}' `;
        }
        logger_all.info("[select query request] : " +  get_user);
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
	// get_whatsapp_list to execute the query
			logger_all.info("[select query request] : " + `SELECT wht.compose_whatsapp_id, wht.user_id, usr.user_name, wht.campaign_name, wht.whatsapp_content, wht.message_type, wht.total_mobileno_count, wht.content_char_count, wht.content_message_count, stt.country_code, stt.mobile_no, stt.comments sender, stt.comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, stt.response_date, stt.delivery_status, stt.read_status FROM whatsapp_report_${user_id}.compose_whatsapp_${user_id} wht left join whatsapp_report_${user_id}.compose_whatsapp_status_${user_id} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where wht.user_id = '${user_id}' order by wht.compose_whatsapp_id desc, stt.comwtap_status_id desc`);
			const get_whatsapp_list = await db.query(`SELECT wht.compose_whatsapp_id, wht.user_id, usr.user_name, wht.campaign_name, wht.whatsapp_content, wht.message_type, wht.total_mobileno_count, wht.content_char_count, wht.content_message_count, stt.country_code, stt.mobile_no, stt.comments sender, stt.comwtap_entry_date, stt.response_status, stt.response_message, stt.response_id, stt.response_date, stt.delivery_status, stt.read_status FROM whatsapp_report_${user_id}.compose_whatsapp_${user_id} wht left join whatsapp_report_${user_id}.compose_whatsapp_status_${user_id} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.user_management usr on wht.user_id = usr.user_id where wht.user_id = '${user_id}' order by wht.compose_whatsapp_id desc, stt.comwtap_status_id desc`);
			logger_all.info("[select query response] : " + JSON.stringify(get_whatsapp_list))
  // if the get message length is '0' to send the no available data.otherwise it will be return the get_messages details.
			if (get_whatsapp_list.length == 0) {
				return {
					response_code: 1,
					response_status: 204,
					response_msg: 'No data available'
				};
			} else {
				return {
					response_code: 1,
					response_status: 200,
					num_of_rows: get_whatsapp_list.length,
					response_msg: 'Success',
					report: get_whatsapp_list
				};
			}
	

	} catch (e) { // any error occurres send error response to client
		logger_all.info("[WhatsappList failed response] : " + e)
		return {
			response_code: 0,
			response_status: 201,
			response_msg: 'Error occured'
		};
	}
}
// WhatsappList - end

// using for module exporting
module.exports = {
	WhatsappList
}