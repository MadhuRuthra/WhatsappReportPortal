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
// PTemplateList function start
async function PTemplateList(req) {
	var logger_all = main.logger_all
	var logger = main.logger
	try {
		//  Get all the req header data
		const header_token = req.headers['authorization'];

		// get all the req data
		var user_id, user_master_id, template_list;
		// To initialize a variable with an empty string value
		var prntid = '';
		var get_template_list = '';
		// query parameters
		logger_all.info("[PTemplateList query parameters] : " + JSON.stringify(req.body));
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
		prntid = user_id;
		if (user_master_id == 3 || user_master_id == 2) {
			// admin - Dept Head are following this to get the parent id
			logger_all.info("[select query request] : " + `SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`)
			const get_parent_id = await db.query(`SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`);
			logger_all.info("[select query response] : " + JSON.stringify(get_parent_id))
			// if number of sql query length  is available then process the will be continued
			// loop all the get the user ids to act as the parent ids.
			for (var i = 0; i < get_parent_id.length; i++) {
				prntid += ',' + get_parent_id[i].user_id;
			}
		}

		if (user_master_id == 4) {// usermasterid value is '0' following get_template_list query
			template_list = `SELECT tmp.unique_template_id ,tmp.template_id,tmp.templateid, tmp.template_name, tmp.template_category, tmp.template_message, tmp.template_response_id, tmp.template_status, DATE_FORMAT(tmp.template_entdate,'%d-%m-%Y %h:%i:%s %p') template_entdate, DATE_FORMAT(tmp.approve_date,'%d-%m-%Y %h:%i:%s %p') approve_date, crt.user_id created_userid, crt.user_name created_username, lng.language_id, lng.language_name, lng.language_code, cnf.whatspp_config_id, cnf.user_id receiver_userid, crev.user_name receiver_username, ums.user_type, cnf.mobile_no, cnf.whatsapp_business_acc_id, cnf.phone_number_id, cnf.bearer_token, cnf.country_id, cnf.country_code, ctr.phonecode, ctr.shortname FROM message_template tmp left join user_management crt on tmp.created_user = crt.user_id left join master_language lng on lng.language_id = tmp.language_id left join whatsapp_config cnf on cnf.whatspp_config_id = tmp.whatsapp_config_id left join user_management crev on crev.user_id = cnf.user_id left join user_master ums on ums.user_master_id = crev.user_master_id left join master_countries ctr on ctr.id = cnf.country_id where (crev.user_id = '${user_id}') order by tmp.template_entdate desc`;
			logger_all.info("[select query request] : " + template_list);
			//logger_all.info("[select query response] : " + JSON.stringify(get_template_list))
		}
		else if (user_master_id == 3 || user_master_id == 2) {
			// usermasterid value is '3' and  usermasterid value is '2'  following get_template_list query
			template_list = `SELECT tmp.unique_template_id ,tmp.template_id, tmp.templateid, tmp.template_name, tmp.template_category, tmp.template_message, tmp.template_response_id, tmp.template_status, DATE_FORMAT(tmp.template_entdate,'%d-%m-%Y %h:%i:%s %p') template_entdate, DATE_FORMAT(tmp.approve_date,'%d-%m-%Y %h:%i:%s %p') approve_date, crt.user_id created_userid, crt.user_name created_username, lng.language_id, lng.language_name, lng.language_code, cnf.whatspp_config_id, cnf.user_id receiver_userid, crev.user_name receiver_username, ums.user_type, cnf.mobile_no, cnf.whatsapp_business_acc_id, cnf.phone_number_id, cnf.bearer_token, cnf.country_id, cnf.country_code, ctr.phonecode, ctr.shortname FROM message_template tmp left join user_management crt on tmp.created_user = crt.user_id left join master_language lng on lng.language_id = tmp.language_id left join whatsapp_config cnf on cnf.whatspp_config_id = tmp.whatsapp_config_id left join user_management crev on crev.user_id = cnf.user_id left join user_master ums on ums.user_master_id = crev.user_master_id left join master_countries ctr on ctr.id = cnf.country_id where (tmp.created_user = '${user_id}' or crev.parent_id in ('${prntid}') ) order by tmp.template_entdate desc`;
			logger_all.info("[select query request] : " + template_list);

			//logger_all.info("[select query response] : " + JSON.stringify(get_template_list))
		} else {
			//otherwise following get_template_list query
			template_list = `SELECT tmp.unique_template_id ,tmp.template_id, tmp.template_name,tmp.templateid,tmp.template_category, tmp.template_message, tmp.template_response_id, tmp.template_status, DATE_FORMAT(tmp.template_entdate,'%d-%m-%Y %h:%i:%s %p') template_entdate, DATE_FORMAT(tmp.approve_date,'%d-%m-%Y %h:%i:%s %p') approve_date, crt.user_id created_userid, crt.user_name created_username, lng.language_id, lng.language_name, lng.language_code, cnf.whatspp_config_id, cnf.user_id receiver_userid, crev.user_name receiver_username, ums.user_type, cnf.mobile_no, cnf.whatsapp_business_acc_id, cnf.phone_number_id, cnf.bearer_token, cnf.country_id, cnf.country_code, ctr.phonecode, ctr.shortname FROM message_template tmp left join user_management crt on tmp.created_user = crt.user_id left join master_language lng on lng.language_id = tmp.language_id left join whatsapp_config cnf on cnf.whatspp_config_id = tmp.whatsapp_config_id left join user_management crev on crev.user_id = cnf.user_id left join user_master ums on ums.user_master_id = crev.user_master_id left join master_countries ctr on ctr.id = cnf.country_id order by tmp.template_entdate desc`;
			logger_all.info("[select query request] : " + template_list);
		}

		var get_template_list = await db.query(template_list);
		//logger_all.info("[select query response] : " + JSON.stringify(get_template_list))	
		// if the get get_template_list length is '0' to send the no available data.otherwise it will be return the get_template_list details.
		if (get_template_list.length == 0) {
			return { response_code: 1, response_status: 204, response_msg: 'No data available' };
		}
		else {
			return { response_code: 1, response_status: 200, num_of_rows: get_template_list.length, response_msg: 'Success', templates: get_template_list };
		}

	}
	catch (e) {// any error occurres send error response to client
		logger_all.info("[PTemplateList failed response] : " + e)
		return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
	}
}
// 	PTemplateList - end
// using for module exporting
module.exports = {
	PTemplateList
}
