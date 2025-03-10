/*
API that allows your frontend to communicate with your backend server (Node.js) for processing and retrieving data.
To access a MySQL database with Node.js and can be use it.
This page is used in template function which is used to get a single template
details.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const db = require("../../db_connect/connect");
const main = require('../../logger')
const env = process.env;
require('dotenv').config();
const api_url = env.API_URL;

var axios = require('axios');
// ManualUploadList - start
async function ManualUploadList(req) {
    try {

        var logger_all = main.logger_all
        //  Get all the req header data
        const header_token = req.headers['authorization'];
        var user_id = req.body.user_id;
        var user_ids = [];
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

        var manual_list = "";


        manual_list = `SELECT DISTINCT cwt.campaign_name, cwt.campaign_id, cwt.total_updated_count, cwt.total_mobileno_count, cwt.whatsapp_status,queue.remarks, cwt.compose_whatsapp_id,cwt.whatsapp_entry_date, cwt.user_id, usr.user_name,tgbase_count  AS count_pj,cgbase_count AS count_yj FROM master_compose_whatsapp cwt LEFT JOIN whatsapp_report.user_management usr ON cwt.user_id = usr.user_id LEFT JOIN whatsapp_report.queue_process queue ON cwt.compose_whatsapp_id = queue.compose_message_id 
         WHERE cwt.whatsapp_status in ('P','V') group by campaign_id ORDER BY whatsapp_entry_date DESC`;

        // Process the approval details for the current user ID
        console.log(`Manual list details for user ID ${user_id}:`, manual_list);


        // logger_all.info("[select query request] : " + manual_list + " order by whatsapp_entry_date");
        const get_report = await db.query(manual_list);
        logger_all.info("[select query response] : " + JSON.stringify(get_report))


        if (get_report.length == 0) {
            return { response_code: 0, response_status: 201, response_msg: 'Template not available' };
        } else {
            return { response_code: 1, response_status: 200, response_msg: 'Success', num_of_rows: get_report.length, report: get_report, pending_mobileno_count: get_report[0].total_updated_count };
        }


    }
    catch (e) { // any error occurres send error response to client
        logger_all.info("[ManualUploadList failed response] : " + e)
        return { response_code: 0, response_status: 201, response_msg: 'Error Occurred ' };
    }
}
// ManualUploadList - end

module.exports = {
    ManualUploadList
};
