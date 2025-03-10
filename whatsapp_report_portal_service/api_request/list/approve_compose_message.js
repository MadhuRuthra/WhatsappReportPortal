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
// approveComposeMessage Function - start
async function approveComposeMessage(req) {
    var logger_all = main.logger_all
    var logger = main.logger
    try {
        //  Get all the req header data
        const header_token = req.headers['authorization'];

        // get all the req data
        var mobile_filter = req.body.mobile_filter;
        // declare the variables
        var user_id, user_master_id;
        var user_ids = [];
        // define the variable
        var prntid = '';
        var whrcondition = ` `;
        // query parameters
        logger_all.info("[approveComposeMessage query parameters] : " + JSON.stringify(req.body));
        // To get the User_id
        var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
        if (req.body.user_id) {
            get_user = get_user + `and user_id = '${req.body.user_id}' `;
        }
        logger_all.info("[select query request] : " + get_user);

        const get_user_id = await db.query(get_user);
        logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
        // If get_user not available send error response to client
        if (get_user_id.length == 0) {
            logger_all.info("Invalid Token")
            return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
        }
        else {// otherwise to get the user details
            user_id = get_user_id[0].user_id;
            user_master_id = get_user_id[0].user_master_id;
        }



        //  admin - dept head are following this to get the userid is act to parent_id
        logger_all.info("[select query request] : " + `SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`)
        const get_parent_id = await db.query(`SELECT user_id FROM user_management where parent_id = '${user_id}' ORDER BY user_id ASC`);
        logger_all.info("[select query response] : " + JSON.stringify(get_parent_id))
        // if number of sql query length  is available then process the will be continued
        // loop all the get the user ids to act as the parent ids.
        for (var i = 0; i < get_parent_id.length; i++) {
            user_ids.push(get_parent_id[i].user_id);
        }
        var array_list_userid_string = user_ids.join("','");


        approve_message = `SELECT c.campaign_name, c.total_mobileno_count, c.tg_base,c.cg_base,c.whatsapp_entry_date as whatsapp_date,DATE_FORMAT(c.whatsapp_entry_date,"%d-%m-%Y %H:%i:%s") whatsapp_entry_date, c.whatsapp_status, c.user_id, c.compose_whatsapp_id, c.total_mobileno_count,  u.user_name FROM master_compose_whatsapp AS c JOIN whatsapp_report.user_management AS u ON c.user_id = u.user_id WHERE c.whatsapp_status in ('P','W','S','V') and c.user_id in ('${array_list_userid_string}') ORDER BY whatsapp_date DESC`;

        logger_all.info("[select query request] : " + approve_message);
        const get_approve_whatsapp_no_api = await db.query(approve_message);

        logger_all.info("[select query response] : " + JSON.stringify(get_approve_whatsapp_no_api))
        // get_approve_whatsapp_no_api length is '0' to through the no data available message. 
        if (get_approve_whatsapp_no_api.length == 0) {
            return { response_code: 1, response_status: 204, response_msg: 'No data available' };
        }
        else { // otherwise get_approve_whatsapp_no_api to get the success message anag get_approve_whatsapp_no_api length and get_approve_whatsapp_no_api details
            return { response_code: 1, response_status: 200, num_of_rows: get_approve_whatsapp_no_api.length, response_msg: 'Success', report: get_approve_whatsapp_no_api };
        }

    }
    catch (e) { // any error occurres send error response to client
        logger_all.info("[approveComposeMessage failed response] : " + e)
        return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
    }
}
// approveComposeMessage Function - end
// using for module exporting
module.exports = {
    approveComposeMessage
}
