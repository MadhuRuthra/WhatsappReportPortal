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
// SenderidAllowedList function - start
async function SenderidAllowedList(req) {
	var logger_all = main.logger_all
    var logger = main.logger
	try {
//  Get all the req header data
		const header_token = req.headers['authorization'];
		
		// declare the variable
		var user_id;
// query parameters
		logger_all.info("[SenderidAllowedList query parameters] : " + JSON.stringify(req.body));
		// To get the User_id
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
		else {// otherwise to get the user details
			user_id = get_user_id[0].user_id;
		}
		//get_senderid_allowed get whatspp_config_status not in ('D', 'B') is get the response to executed is continued.
			logger_all.info("[select query request] : " + `SELECT count(user_id) cntusr FROM whatsapp_config where whatspp_config_status not in ('D', 'B') and user_id = '${user_id}'`);
			const get_senderid_allowed = await db.query(`SELECT count(user_id) cntusr FROM whatsapp_config where whatspp_config_status not in ('D', 'B') and user_id = '${user_id}'`);
			logger_all.info("[select query response] : " + JSON.stringify(get_senderid_allowed))
  // if the get get_senderid_allowed length is '0' to send the no available data.otherwise it will be return the get_senderid_allowed details.
			if (get_senderid_allowed.length == 0) {
				return { response_code: 1, response_status: 204, response_msg: 'No data available' };
			}
			else {
				return { response_code: 1, response_status: 200, num_of_rows: get_senderid_allowed.length, response_msg: 'Success', report: get_senderid_allowed };
			}
		
	}
	catch (e) {// any error occurres send error response to client
		logger_all.info("[SenderidAllowedList failed response] : " + e)
		return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
	}
}
// SenderidAllowedList - end

// using for module exporting
module.exports = {
	SenderidAllowedList
}