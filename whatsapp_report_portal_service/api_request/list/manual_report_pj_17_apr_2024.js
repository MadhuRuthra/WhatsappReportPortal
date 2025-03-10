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
const db = require("../../db_connect/dynamic_connect");
require("dotenv").config();
const main = require('../../logger');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment');

async function ManualReportPJ(req, res) {

  var logger = main.logger

  var logger_all = main.logger_all;

  const admin_user_id = req.body.user_id;
  const user_id = req.body.compose_user_id;
  const compose_id = req.body.compose_id;
  const file = req.body.file;
  const reportType = req.body.reportType;
  console.log(reportType);
  console.log(user_id);
  console.log(compose_id);
  console.log(file);
  logger_all.info("CSV file process started")
  const csvFilePath = "/var/www/html/whatsapp_report_portal/uploads/pj_report_file/" + file;

  const batchSize = 10000; // Experiment with different batch sizes

  var select_query = `SELECT * from whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} WHERE whatsapp_status = 'P' AND compose_whatsapp_id = '${compose_id}'`
  logger.info(select_query);
  await db.query(select_query);

  if (select_query.length == 0) {
    return { response_code: 0, response_status: 201, response_msg: 'Report generation in progress.' };
  }

 await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'V' WHERE compose_whatsapp_id = ?", [compose_id]);
            logger.info(`Updated whatsapp_status to 'V' for compose ID ${compose_id}`);

  // Use a stream to read the CSV file
  const readStream = fs.createReadStream(csvFilePath);
  const rows = [];

  readStream
    .pipe(csvParser())
    .on('data', async (row, index) => {
      // Skip the header row (assuming it's the first row)
      if (index === 0) return;
//       logger_all.info(JSON.stringify(row));

//	logger_all.info(row['Receiver']+"=="+row['Status'] +"--"+row['Delivery Date'] +"!!"+row['Delivery Time']);
      // Check if the row has 9 columns
    //  if ((row['Receiver'] != "" && row['Receiver'] != null) && (row['Status'] != "" && row['Status'] != null) && (row['Delivery Date'] != "" && row['Delivery Date'] != null)) {

        const mobileNumber = row['Receiver'];
        const deliveryStatusvalue = row['Status'] == 1 ? "NOT AVAILABLE" : row['Status'];
	const parsedDate = moment(row['Delivery Date'], ['DD-MM-YYYY', 'YYYY-MM-DD']);


        // Format the parsed date in the desired output format
        const convertedDate = parsedDate.format('YYYY-MM-DD');

        //const deliveryDate = `${convertedDate} ${row['Delivery Time']}:00`;

	const deliveryDate = `${convertedDate} ${row['Delivery Time']}`;

        // Validate delivery status and delivery date
        if (typeof deliveryStatusvalue === 'string' && moment(deliveryDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
          const deliveryStatus = deliveryStatusvalue.toUpperCase();
          rows.push([deliveryStatus, deliveryDate, mobileNumber]);

        } else {
          logger_all.info(`Invalid delivery status or delivery date for row at index ${index}. Skipping...`);
        }
     // } else {
       // logger_all.info(`Row at index ${index} does not have 9 columns. Skipping...`);
     // }
    })
    .on('end', async () => {
      // Update remaining rows in the database
      /*if (rows.length > 0) {
          await updateDatabase(rows, user_id, compose_id);
      }

for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          console.log("Processing batch", i / batchSize + 1);
          await updateDatabase(batch, user_id, compose_id);
      }*/

      var update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET `
      var col1 = "delivery_status = CASE "
      var col2 = "delivery_date = CASE "
      var wher_numbers = ""
	logger_all.info(rows.length);
      for (let i = 0; i < rows.length; i++) {
//        logger_all.info("********************"+i)
        col1 = col1 + `WHEN mobile_no = '${rows[i][2]}' THEN '${rows[i][0]}' `
        col2 = col2 + `WHEN mobile_no = '${rows[i][2]}' THEN '${rows[i][1]}' `
        wher_numbers = wher_numbers + `'${rows[i][2]}',`
        if (i % batchSize === 0) {
	logger_all.info("batch updating ............"+i);
          col1 = col1 + `ELSE delivery_status END,`
          col2 = col2 + `ELSE delivery_date END `
          wher_numbers = wher_numbers.slice(0, -1)
          update_query = update_query + col1 + col2 + `WHERE mobile_no in (${wher_numbers}) AND report_group='${reportType}' AND compose_whatsapp_id = '${compose_id}'`
      //    logger.info(update_query);
          await db.query(update_query);

          update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET `
          col1 = "delivery_status = CASE "
          col2 = "delivery_date = CASE "
          wher_numbers = ""
        }
        // const batch = rows.slice(i, i + batchSize);
        // console.log("Processing batch", i / batchSize + 1);
        // logger.info(batch);
        // await updateDatabase(batch, user_id, compose_id);

      }
//	logger_all.info(wher_numbers)
     if(wher_numbers != ""){
      col1 = col1 + `ELSE delivery_status END,`
      col2 = col2 + `ELSE delivery_date END `
      wher_numbers = wher_numbers.slice(0, -1)
      update_query = update_query + col1 + col2 + `WHERE mobile_no in (${wher_numbers}) AND report_group='${reportType}' AND compose_whatsapp_id = '${compose_id}'`
    //logger.info(update_query);
      await db.query(update_query);
	}


            var select_count = await db.query(`SELECT COUNT(*) as total_count,COUNT( CASE WHEN delivery_status is not NULL THEN delivery_status END) as total_updated from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} WHERE report_group = '${reportType}' and compose_whatsapp_id = '${compose_id}';`);
            logger.info(`Updated whatsapp_status to 'V' for compose ID ${compose_id}`);

            if(select_count[0].total_count != select_count[0].total_updated){
                await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'P' WHERE compose_whatsapp_id = ?", [compose_id]);
                logger.info(`Updated whatsapp_status to 'P' for compose ID ${compose_id}`);
            }

      logger_all.info('CSV file processing completed.');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

// using for module exporting
module.exports = {
  ManualReportPJ
}
