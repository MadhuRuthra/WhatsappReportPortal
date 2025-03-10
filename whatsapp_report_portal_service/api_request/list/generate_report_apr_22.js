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
const moment = require('moment');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');


async function generatereport(req, res) {
    var logger = main.logger

    var logger_all = main.logger_all;

    const user_id = req.body.compose_user_id;
    const campaign_id = req.body.compose_id;
    console.log(user_id);
    console.log(campaign_id);
    const currentDate = new Date();

    // Format date and time without spaces

    logger_all.info('CSV file processing started.');
    // Use a stream to read the CSV file
    var data = [];

    var select_query = `SELECT usr.user_name,cmm.whatsapp_entry_date,cmm.campaign_name,cmm.campaign_id as compose_whatsapp_id,tmp.templateid as template_id,cmm.whatsapp_entry_date,cmp.mobile_no,cmp.delivery_status,cmp.delivery_date from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} cmp
    LEFT JOIN whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} cmm ON cmm.compose_whatsapp_id = cmp.compose_whatsapp_id LEFT JOIN whatsapp_report.message_template tmp ON tmp.unique_template_id = cmm.unique_template_id LEFT JOIN whatsapp_report.user_management usr ON usr.user_id = cmm.user_id 
    WHERE cmp.compose_whatsapp_id = '${campaign_id}' order by whatsapp_entry_date;`
    logger_all.info(select_query);
    var report_data = await db.query(select_query);

    if (report_data.length == 0) {
        return { response_code: 0, response_status: 201, response_msg: 'No data available.' };
    }
    // return { response_code: 0, response_status: 201, response_msg: 'No data available.' };

    var campaign_name_file = report_data[0].campaign_name.replaceAll("\n", "");
    var filename = `/var/www/html/whatsapp_report_portal/uploads/pj_report_file/${campaign_name_file}.csv`

    for (var i = 0; i < report_data.length; i++) {
        var single_data = report_data[i]
        console.log(single_data)

        const only_date_full = moment(single_data.whatsapp_entry_date);

        // Format the datetime to yyyy-mm-dd
        const only_date = only_date_full.format('YYYY-MM-DD');

        const parsedDateTime = moment(single_data.delivery_date);

        // Format the datetime to yyyy-mm-dd hh:ii:ss
        var formattedDateTime = parsedDateTime.format('YYYY-MM-DD');
        formattedDateTime = formattedDateTime == 'Invalid date' ? "" : formattedDateTime;
        var campaign_name = single_data.campaign_name.replaceAll("\n", "");

        data.push(
            { date: only_date, user_name: single_data.user_name, campaign_name: campaign_name, campaign_id: single_data.compose_whatsapp_id.replaceAll("\n", ""), template_id: single_data.template_id, mobile_no: single_data.mobile_no, delivery_time: formattedDateTime, delivery_status: single_data.delivery_status }
        )
    }

    // Define CSV file headers
    const csvWriter = createObjectCsvWriter({
        path: filename,
        header: [
            { id: 'date', title: 'Date' },
            { id: 'user_name', title: 'User name' },
            { id: 'campaign_name', title: 'Campaign name' },
            { id: 'campaign_id', title: 'Campaign ID' },
            { id: 'template_id', title: 'Template ID' },
            { id: 'mobile_no', title: 'Mobile no' },
            { id: 'delivery_time', title: 'Delivery date' },
            { id: 'delivery_status', title: 'Delivery status' }
        ]
    });

    csvWriter.writeRecords(data)
        .then(async () => {
            logger_all.info('CSV file written successfully - ' + filename);

            var update_cam_status = ` UPDATE whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} SET whatsapp_status = 'S' WHERE compose_whatsapp_id = '${campaign_id}';`
            logger.info(update_cam_status);
            var update_cam_status_result = await db.query(update_cam_status);

            var update_compose = await db.query("UPDATE master_compose_whatsapp " + "SET whatsapp_status = 'S' WHERE compose_whatsapp_id = ? and user_id = ?", [campaign_id, user_id]);

            logger_all.info(JSON.stringify(update_compose));

            var update_cam_data = ` UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET campaign_status = 'Y' WHERE compose_whatsapp_id = '${campaign_id}';`
            logger.info(update_cam_data);
            var update_cam_data_result = await db.query(update_cam_data);

            var update_summary = ` UPDATE whatsapp_report.user_summary_report SET report_status = 'Y' WHERE com_msg_id = '${campaign_id}' and user_id = '${user_id}' and campaign_name = '${campaign_name}'`;
            logger.info(update_summary);
            var update_summary_result = await db.query(update_summary);

            return { response_code: 1, response_status: 200, response_msg: 'Success.' };

        })
        .catch((error) => {
            console.error('Error writing CSV file:', error);
            return { response_code: 0, response_status: 201, response_msg: 'Error Occurred.' };
        });
}
// using for module exporting
module.exports = {
    generatereport
}
