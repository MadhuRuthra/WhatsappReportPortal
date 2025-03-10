/*
This api has dashboard API functions which is used to routing the dashboard.
This page is used to create the url for dashboard API functions .
It will be used to run the dashboard process to check and the connect database to get the response for this function.
After get the response from API, send it back to callfunctions.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const db = require("../../db_connect/connect");
const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment');
const main = require('../../logger');
// Define the function containing the logic you want to run periodically
async function cronfolder() {

  var logger_all = main.logger_all
  var logger = main.logger

  try {

    var queue_check = `SELECT * FROM queue_process where status = 'P'`;
    var queue_check_result = await db.query(queue_check);
    console.log("************88")
    console.log(queue_check_result);

    if (queue_check_result.length > 0) {
      // throw new Error("No available data for queue process");
      return;
    }

    console.log("................")
    const batchSize = 1000; // Experiment with different batch sizes
    var total_mobilenos = []
    var select_queue = `SELECT * FROM queue_process where status = 'Y' limit 1`;
    var select_queue_result = await db.query(select_queue);

    if (select_queue_result.length == 0) {
      logger_all.info("No available data for queue process");
      return;
    }

    console.log(select_queue_result);
    var user_id = select_queue_result[0].user_id;
    var compose_id = select_queue_result[0].compose_message_id;
    var csvFilePath = select_queue_result[0].file_path;
    var reportType = select_queue_result[0].report_type;


    var select_query = `SELECT * from whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} WHERE whatsapp_status = 'V' AND compose_whatsapp_id = '${compose_id}'`
    logger_all.info(select_query);


    var data = await db.query(select_query);

    if (data.length == 0) {
      logger_all.info(`No available data for compose_whatsapp_tmpl Table For 'V' Status.`);
    }

    var update_queue = `Update queue_process set status = 'P' where compose_message_id = '${compose_id}' and user_id = '${user_id}'`;
    var update_queue_result = await db.query(update_queue);
    // logger_all.info(JSON.stringify(update_queue_result));
    const rows = [];
    var remarks;
    let count = 0;
    var invalid_date = '';
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', async (row, index) => {
        // Skip the header row (assuming it's the first row)
        if (index === 0) return;
        const mobileNumber = row['Receiver'];
        if (mobileNumber !== undefined && mobileNumber !== null) {
          total_mobilenos.push(mobileNumber);
          count++; // Increment the count for each valid value in the first column
        }

        const deliveryStatusvalue = row['Status'] == 1 ? "NOT AVAILABLE" : row['Status'];
        const parsedDate = moment(row['Delivery Date'], ['DD-MM-YYYY', 'YYYY-MM-DD']);
        // Format the parsed date in the desired output format
        const convertedDate = parsedDate.format('YYYY-MM-DD');
        //const deliveryDate = `${convertedDate} ${row['Delivery Time']}:00`;
        const deliveryDate = `${convertedDate} ${row['Delivery Time']}`;
        // Validate delivery status and delivery date
        if (typeof deliveryStatusvalue === 'string' && moment(deliveryDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
          const deliveryStatus = deliveryStatusvalue.toUpperCase();
          // logger_all.info("");
          rows.push([deliveryStatus, deliveryDate, mobileNumber]);
        } else {
          // logger_all.info(`Invalid delivery status or delivery date for row at index ${index}. Skipping...`);
          // remarks.push(index);
          invalid_date++;
        }
      })
      .on('end', async () => {
        try {
          const response = await file_processing();
          // Return the response here
        } catch (error) {
          console.error('Error processing file:', error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
      });
    var update_report_status; var update_query_1;
    async function file_processing() {

      var select_count = await db.query(`SELECT COUNT(*) as total_count,COUNT( CASE WHEN delivery_status is not NULL THEN delivery_status END) as total_updated from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} WHERE report_group = '${reportType}' and compose_whatsapp_id = '${compose_id}'`);

      // logger_all.info(`SELECT COUNT(*) as total_count,COUNT( CASE WHEN delivery_status is not NULL THEN delivery_status END) as total_updated from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} WHERE report_group = '${reportType}' and compose_whatsapp_id = '${compose_id}'`);

      var pending_count = select_count[0].total_count - select_count[0].total_updated;
      logger_all.info(pending_count)
      logger_all.info(count);



      logger_all.info(invalid_date + "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

      if (invalid_date) {
        invalid_date = invalid_date + " Invalid delivery status or delivery date";
      } else if (pending_count > count) {
        invalid_date = pending_count - count + " Mobile number is missing";

        //var update_compose = await db.query(`UPDATE whatsapp_report.master_compose_whatsapp SET total_updated_count = '${pending_count - count}' WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_id, user_id]);

        //logger_all.info(JSON.stringify(update_compose));
      }

      if (invalid_date) {
        var update_queue = `Update queue_process set remarks = '${invalid_date}' where status = 'P' and compose_message_id = '${compose_id}' and user_id = '${user_id}'`;
        var update_queue_result = await db.query(update_queue);
        logger_all.info(JSON.stringify(update_queue_result));
      }

      var update_wht_report = await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'V' WHERE compose_whatsapp_id = ?", [compose_id]);
      logger_all.info(`Updated whatsapp_status to 'V' for compose ID ${compose_id}`);

      var update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET `
      var col1 = "delivery_status = CASE "
      var col2 = "delivery_date = CASE "
      var wher_numbers = ""
      var update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET `
      var col1 = "delivery_status = CASE "
      var col2 = "delivery_date = CASE "
      var wher_numbers = ""
      logger_all.info(rows.length);

      delivery_status = [];
      delivery_time_date = [];

      for (let i = 0; i < rows.length; i++) {
        delivery_status.push(rows[i][0].toUpperCase());

        // Push the delivery date and time into the delivery_time_date array
        delivery_time_date.push(rows[i][1]);
        col1 = col1 + `WHEN mobile_no = '${rows[i][2]}' THEN '${rows[i][0]}' `
        col2 = col2 + `WHEN mobile_no = '${rows[i][2]}' THEN '${rows[i][1]}' `
        wher_numbers = wher_numbers + `'${rows[i][2]}',`

        if (i % batchSize === 0) {
          logger_all.info("batch updating ............" + i);
          col1 = col1 + `ELSE delivery_status END,`
          col2 = col2 + `ELSE delivery_date END `
          wher_numbers = wher_numbers.slice(0, -1)
          update_query = update_query + col1 + col2 + `WHERE mobile_no in (${wher_numbers}) AND report_group='${reportType}' AND compose_whatsapp_id = '${compose_id}'`
          //logger_all.info(update_query);
          update_report_status = await db.query(update_query);
          // logger_all.info(JSON.stringify(update_report_status));
          update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET `
          col1 = "delivery_status = CASE "
          col2 = "delivery_date = CASE "
          wher_numbers = ""
        }
      }

      if (wher_numbers != "") {
        col1 = col1 + `ELSE delivery_status END,`
        col2 = col2 + `ELSE delivery_date END `
        wher_numbers = wher_numbers.slice(0, -1)
        update_query = update_query + col1 + col2 + `WHERE mobile_no in (${wher_numbers}) AND report_group='${reportType}' AND compose_whatsapp_id = '${compose_id}'`
        // logger_all.info(update_query);
        update_query_1 = await db.query(update_query);
        // logger_all.info(JSON.stringify(update_query_1));
        logger_all.info(update_query_1.affectedRows)

      }

      // async function findNotExistingMobileNumbers(mobileNumbers) {
      //   const query = `SELECT mobile_no FROM whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id}
      //           WHERE mobile_no IN (${mobileNumbers.map(num => `'${num}'`).join(',')}) AND compose_whatsapp_id = '${compose_id}'`;
      //   // logger_all.info(query);
      //   const results = await db.query(query);
      //   const existingMobileNumbers = results.map(row => row.mobile_no);
      //   const notExistingMobileNumbers = mobileNumbers.filter(num => !existingMobileNumbers.includes(num));
      //   return notExistingMobileNumbers;
      // }

      // findNotExistingMobileNumbers(total_mobilenos)
      //   .then(async (notExistingMobileNumbers) => {
      //     logger_all.info("Mobile numbers not existing in the database:", notExistingMobileNumbers);
      //     if (notExistingMobileNumbers.length <= 20) {
      //       logger_all.info("coming");
      //       // Pass notExistingMobileNumbers as a parameter to insert_status function
      //       await insert_status(notExistingMobileNumbers);
      //     } else {
      //       logger_all.info("NotExistingMobileNumbers Count is 20 above");
      //     }
      //   });

      // async function insert_status(notExistingMobileNumbers) {
      //   // Handle insertion of not existing mobile numbers
      //   if (notExistingMobileNumbers.length > 0 && notExistingMobileNumbers.length <= 20) {
      //     logger_all.info("Not existing mobile numbers:", notExistingMobileNumbers);
      //     var db_name = `whatsapp_report_${user_id}`;
      //     var table_names = `whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id}`;
      //     var insert_query = `INSERT INTO ${table_names} VALUES`;
      //     logger_all.info(total_mobilenos.length);
      //     logger_all.info(delivery_status.length);
      //     logger_all.info(delivery_time_date.length);
      //     // Construct the insertion query for all rows with not existing mobile numbers
      //     for (let i = 0; i < notExistingMobileNumbers.length; i++) {
      //       const index = total_mobilenos.indexOf(notExistingMobileNumbers[i]);
      //       logger_all.info(index) + "index";
      //       const status_index = delivery_status[index];
      //       logger_all.info(status_index + "status_index")
      //       const date_index = delivery_time_date[index];
      //       insert_query += `(NULL,${compose_id},NULL,'${notExistingMobileNumbers[i]}','${reportType}','-','N',CURRENT_TIMESTAMP,NULL,NULL,NULL,NULL,'${status_index}','${date_index}',NULL,NULL,'N'),`;
      //     }

      //     // Remove the trailing comma from the batch insertion query
      //     insert_query = insert_query.substring(0, insert_query.length - 1);
      //     // Execute the insertion query to insert all rows with not existing mobile numbers
      //     const insertResult = await db.query(insert_query, null, db_name);
      //     logger_all.info("Batch insert query response:", insertResult);

      //     var update_query = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} SET total_mobileno_count = total_mobileno_count + ${notExistingMobileNumbers.length},content_message_count =  content_message_count + ${notExistingMobileNumbers.length} WHERE compose_whatsapp_id = ?`;
      //     // Execute the update query to update other tables
      //     const updateResult = await db.query(update_query, [compose_id]);
      //     logger_all.info("Update query response:", updateResult);
      //   }
      //   var update_summary = `UPDATE whatsapp_report.user_summary_report SET total_msg = total_msg+ ${notExistingMobileNumbers.length} WHERE com_msg_id = '${compose_id}'`;
      //   logger_all.info("[update_summary_report] : " + update_summary);
      //   update_summary_results = await db.query(update_summary);
      //   logger_all.info("[update_summary_report response] : " + JSON.stringify(update_summary_results))
      // }

      var select_count = await db.query(`SELECT COUNT(*) as total_count,COUNT( CASE WHEN delivery_status is not NULL THEN delivery_status END) as total_updated from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} WHERE report_group = '${reportType}' and compose_whatsapp_id = '${compose_id}'`);

      logger_all.info(`SELECT COUNT(*) as total_count,COUNT( CASE WHEN delivery_status is not NULL THEN delivery_status END) as total_updated from whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} WHERE report_group = '${reportType}' and compose_whatsapp_id = '${compose_id}'`);

      if (select_count[0].total_count != select_count[0].total_updated) {
        var update_2 = await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'P' WHERE compose_whatsapp_id = ?", [compose_id]);
        logger_all.info(`Updated whatsapp_status to 'P' for compose ID ${compose_id}`);

        var update_compose = await db.query("UPDATE master_compose_whatsapp " + "SET whatsapp_status = 'P' WHERE compose_whatsapp_id = ? and user_id = ?", [compose_id, user_id]);

        logger_all.info(JSON.stringify(update_compose));
      }

      var select_status_count = `SELECT COUNT(DISTINCT CASE WHEN delivery_status = 'SENT' THEN comwtap_status_id END) AS total_success,COUNT(DISTINCT CASE WHEN delivery_status = 'DELIVERED' THEN comwtap_status_id END) AS total_delivered, COUNT(DISTINCT CASE WHEN delivery_status = 'READ' THEN comwtap_status_id END) AS total_read,COUNT(DISTINCT CASE WHEN delivery_status IN ('BLOCKED', 'INCAPABLE', 'NOT AVAILABLE', 'FAILED','INVALID','UNAVAILABLE') THEN comwtap_status_id END) AS total_failed, COUNT(DISTINCT CASE WHEN delivery_status = 'INVALID' THEN comwtap_status_id END) AS total_invalid FROM whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} where compose_whatsapp_id = '${compose_id}'`;
      logger_all.info("[update_summary_report] : " + select_status_count);
      var status_count_result = await db.query(select_status_count);
      logger_all.info("[update_summary_report response] : " + JSON.stringify(status_count_result))

      var failed_count = status_count_result[0].total_failed + status_count_result[0].total_invalid;
      var success_count = status_count_result[0].total_success;
      var read_count = status_count_result[0].total_read;
      var delivery_count = status_count_result[0].total_delivered;

      var totaltg_count = failed_count + success_count + read_count + delivery_count;

      var update_summary = `UPDATE whatsapp_report.user_summary_report SET total_waiting = 0,total_process = 0,total_failed = ${failed_count},total_read = ${read_count},total_delivered = + ${delivery_count},total_success = ${success_count},sum_end_date = CURRENT_TIMESTAMP WHERE com_msg_id = '${compose_id}' and user_id = '${user_id}'`;

      logger_all.info("[update_summary_report] : " + update_summary);
      update_summary_results = await db.query(update_summary);
      logger_all.info("[update_summary_report response] : " + JSON.stringify(update_summary_results))

      console.log(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_tgbase = '${totaltg_count}' WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_id, user_id]);
      var update_compose = await db.query(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_tgbase = '${totaltg_count}',total_updated_count = ${totaltg_count} WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_id, user_id]);
      logger_all.info("[master_compose_whatsapp] : " + JSON.stringify(update_compose));

      // await sleep(120000)

      var update_queue = `Update queue_process set status = 'C' where compose_message_id = '${compose_id}' and user_id = '${user_id}'`;
      var update_queue_result = await db.query(update_queue);
      logger_all.info(JSON.stringify(update_queue_result));
      logger_all.info('CSV file processing completed.');

      await sleep(60000)

      cronfolder();

    }
  } catch (err) {// any error occurres send error response to client
    logger_all.info("[Cron Process - failed response] : " + err)
    console.error(err)
    return {
      response_code: 0,
      response_status: 201,
      response_msg: 'Error occured'
    };
  }
}
// manual_report_pj - end

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export the function so that it can be called from outside
module.exports = cronfolder;
