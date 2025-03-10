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

async function generatereportlist(req) {

    try {
        const header_token = req.headers['authorization'];
        var user_id = req.body.user_id;

        const userIdQuery = "SELECT user_id FROM whatsapp_report.user_management";
        const userIds = await db.query(userIdQuery);

        var report_generate_list = "";
        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i].user_id;
		report_generate_list = report_generate_list+`
    		SELECT 
        	c.campaign_name, 
        	c.total_mobileno_count, 
        	c.whatsapp_entry_date, 
        	u.user_name, 
	        c.compose_whatsapp_id,
                c.whatsapp_status,
                c.user_id,
        	SUM(CASE WHEN cw.report_group = 'TGBase' AND cw.delivery_status != 'NULL' THEN 1 ELSE 0 END) AS count_TGBase, 
        	SUM(CASE WHEN cw.report_group = 'CGBase' AND cw.delivery_status != 'NULL' THEN 1 ELSE 0 END) AS count_CGBase,
		SUM(CASE WHEN cw.delivery_status != 'NULL' THEN 1 ELSE 0 END) AS total_upload_count
    		FROM 
        		whatsapp_report_${userId}.compose_whatsapp_tmpl_${userId} AS c
    			JOIN 
        		whatsapp_report.user_management AS u ON c.user_id = u.user_id
    			JOIN 
        		whatsapp_report_${userId}.compose_whatsapp_status_tmpl_${userId} AS cw ON c.compose_whatsapp_id = cw.compose_whatsapp_id Group By c.compose_whatsapp_id
		
		UNION`;

        }
        report_generate_list = report_generate_list.slice(0, -7)+` ORDER BY whatsapp_entry_date DESC`;

	console.log(report_generate_list);

        const get_approve_whatsapp_no_api = await db.query(report_generate_list);

        if (get_approve_whatsapp_no_api.length == 0) {
            return { response_code: 1, response_status: 204, response_msg: 'No data available' };
        } else {
            return { response_code: 1, response_status: 200, num_of_rows: get_approve_whatsapp_no_api.length, response_msg: 'Success', report: get_approve_whatsapp_no_api };
        }
    } catch (e) {
        console.error("Error occurred:", e);
        return { response_code: 0, response_status: 201, response_msg: 'Error occurred' };
    }
}



// approveComposeMessage Function - end
// using for module exporting
module.exports = {
	generatereportlist
}

