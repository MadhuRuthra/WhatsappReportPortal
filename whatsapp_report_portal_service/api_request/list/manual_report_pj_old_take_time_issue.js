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
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment'); 

// download_compose_message - start
/*async function ManualReportPJ(req, res) {
    const admin_user_id = req.body.user_id;
    const user_id = req.body.compose_user_id;
    const compose_id = req.body.compose_id;
    const file = req.body.file;
    const reportType = req.body.reportType;
    console.log(reportType);
    console.log(user_id);
    console.log(compose_id);
    console.log(file);

    const csvFilePath = "/var/www/html/whatsapp_report_portal/uploads/pj_report_file/" + file;
    const rows = [];

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', async (row, index) => {
            // Skip the header row (assuming it's the first row)
            if (index === 0) return;
            console.log(row);
            
            // Check if the row has 9 columns
            if (Object.keys(row).length === 9) {
                // Extract required data from the row
                const mobileNumber = row['Mobile Number'];
                const deliveryStatusvalue = row['Delivery Status'];
                const deliveryDate = row['Delivery Date'];

                // Validate delivery status and delivery date
                if (typeof deliveryStatusvalue === 'string' && moment(deliveryDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {

		    deliveryStatus = deliveryStatusvalue.toUpperCase();
                    // Update the database based on extracted data
                    try {
                        await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " SET delivery_status = ?, delivery_date = ?, campaign_status = 'Y' WHERE mobile_no = ? AND report_group = ? AND compose_whatsapp_id = ?", [deliveryStatus, deliveryDate, mobileNumber, reportType, compose_id]);

                        console.log(`Updated record for mobile number ${mobileNumber}`);


                    } catch (error) {
                        console.error(`Error updating record for mobile number ${mobileNumber}:`, error);
                    }
                } else {
                    console.log(`Invalid delivery status or delivery date for row at index ${index}. Skipping...`);
                }
            } else {
                console.log(`Row at index ${index} does not have 9 columns. Skipping...`);
            }
        })
        .on('end', async () => {

		// Count occurrences of campaign_status
                const countQuery = "SELECT COUNT(*) AS count FROM whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " WHERE compose_whatsapp_id = ? AND campaign_status = 'N'";
                try {
                        console.log(countQuery);
                        const rows = await db.query(countQuery, [compose_id]);
                        const count = rows.count;
                        console.log(count);
            
                        if (Array.isArray(rows) && rows.length > 0) {
                            const count = rows[0].count;
                            console.log(count);

                            // Update whatsapp_status in compose_whatsapp_tmp table if count is zero
                            if (count === 0) {
                                await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'S' WHERE compose_whatsapp_id = ?", [compose_id]);
                                console.log(`Updated whatsapp_status to 'Y' for compose ID ${compose_id}`);
                            }
                        } else {
                                console.error(`No rows returned for count query`);
                           }
                    } catch (error) {
                        console.error(`Error occurred while counting campaign_status:`, error);
                    }
            	console.log('CSV file processing completed.');
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
}*/




async function ManualReportPJ(req, res) {
    const admin_user_id = req.body.user_id;
    const user_id = req.body.compose_user_id;
    const compose_id = req.body.compose_id;
    const file = req.body.file;
    const reportType = req.body.reportType;
    console.log(reportType);
    console.log(user_id);
    console.log(compose_id);
    console.log(file);

    const csvFilePath = "/var/www/html/whatsapp_report_portal/uploads/pj_report_file/" + file;

    let batchCount = 0;
    let updateCount = 0;
    let batchData = [];

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', async (row, index) => {
            // Skip the header row (assuming it's the first row)
            if (index === 0) return;

            // Check if the row has 9 columns
            if (Object.keys(row).length === 9) {
                // Extract required data from the row
                const mobileNumber = row['Mobile Number'];
                const deliveryStatusvalue = row['Delivery Status'];
                const deliveryDate = row['Delivery Date'];

                // Validate delivery status and delivery date
                if (typeof deliveryStatusvalue === 'string' && moment(deliveryDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
                    const deliveryStatus = deliveryStatusvalue.toUpperCase();
                    batchData.push([deliveryStatus, deliveryDate, mobileNumber, reportType, compose_id]);
                    updateCount++;

                    if (batchData.length >= 10000) {
                        // Update the database with the batch data
                        await updateBatch(batchData, user_id);
                        batchData = [];
                        batchCount++;
                        console.log(`Processed batch ${batchCount}`);
                    }
                } else {
                    console.log(`Invalid delivery status or delivery date for row at index ${index}. Skipping...`);
                }
            } else {
                console.log(`Row at index ${index} does not have 9 columns. Skipping...`);
            }
        })
        .on('end', async () => {

		  // Count occurrences of campaign_status
                const countQuery = "SELECT COUNT(*) AS count FROM whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " WHERE compose_whatsapp_id = ? AND campaign_status = 'N'";
                try {
                     	console.log(countQuery);
                        const rows = await db.query(countQuery, [compose_id]);
                        const count = rows.count;
                        console.log(count);

                        if (Array.isArray(rows) && rows.length > 0) {
                            const count = rows[0].count;
                            console.log(count);

                            // Update whatsapp_status in compose_whatsapp_tmp table if count is zero
                            if (count === 0) {
                                await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'S' WHERE compose_whatsapp_id = ?", [compose_id]);
                                console.log(`Updated whatsapp_status to 'Y' for compose ID ${compose_id}`);
                            }
                        } else {
                                console.error(`No rows returned for count query`);
                           }
                    } catch (error) {
                        console.error(`Error occurred while counting campaign_status:`, error);
                    }
                console.log('CSV file processing completed.');

        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
}

async function updateBatch(batchData, user_id) {
    try {
       // const query = "UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " SET delivery_status = ?, delivery_date = ?, campaign_status = 'Y' WHERE mobile_no = ? AND report_group = ? AND compose_whatsapp_id = ?";
	  const query = "UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " SET delivery_status = ?, delivery_date = ?, campaign_status = 'Y' WHERE mobile_no = ? AND report_group = ? AND compose_whatsapp_id = ?";

        await db.query(query, batchData);
    } catch (error) {
        console.error('Error updating batch:', error);
    }
}


/*async function updateBatch(batchData, user_id) {
    try {
        const placeholders = batchData.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const values = batchData.flatMap(data => [...data]);
        const query = "UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_status_tmpl_" + user_id + " SET delivery_status = ?, delivery_date = ?, campaign_status = 'Y' WHERE mobile_no = ? AND report_group = ? AND compose_whatsapp_id = ?";
        await db.query(query, values);
    } catch (error) {
        console.error('Error updating batch:', error);
    }
}*/

// using for module exporting
module.exports = {
	ManualReportPJ
}
