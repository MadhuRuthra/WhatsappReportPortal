/*
API that allows your frontend to communicate with your backend server (Node.js) for processing and retrieving data.
To access a MySQL database with Node.js and can be use it.
This page is used in dashboard functions which is used to get the dashboard details.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
const db = require("../../db_connect/connect");
require('dotenv').config()
const main = require('../../logger');
// dashboard otp Function - start
async function otp_Dash_Board(req) {
 var logger_all = main.logger_all
    var logger = main.logger
    try {
        //  Get all the req header data
        const header_token = req.headers['authorization'];
        // Get all the req data
        var user_id = req.body.user_id;
        // declare the variables
        var user_permission;
        var user_master_id;
        var list_user_id;
        var dashboard_user;
        var list_user_id_1;
        // declare the array
        var array_list_user_id = [];
        var total_response = [];
        var total_available_messages = [];
        var total_user_id = [];
        var total_user_master_id = [];
        var total_user_name = [];
        // To initialize a variable with an empty string value
        list_user_id = '';
        dashboard_user = '';
        // to get the today date
        var day = new Date();
        var today_date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
// var today_date = day.getDate() + '-' + (day.getMonth() + 1) + '-' + day.getFullYear();
        // query parameters
        logger_all.info("[Dashboard query parameters] : " + JSON.stringify(req.body));
        // To get the User_id
        var get_user = `SELECT * FROM user_management where bearer_token = '${header_token}' AND usr_mgt_status = 'Y' `;
        if (req.body.user_id) {
            get_user = get_user + `and user_id = '${req.body.user_id}' `;
        }
        logger_all.info("[select query request] : " + get_user);
        const get_user_id = await db.query(get_user);
        logger_all.info("[select query response] : " + JSON.stringify(get_user_id));
        // If get_user not available send error response to client in ivalid token
        if (get_user_id.length == 0) {
            logger_all.info("Invalid Token")
            return { response_code: 0, response_status: 201, response_msg: 'Invalid Token' };
        }
        else { // otherwise to get the user details
            user_id = get_user_id[0].user_id;
            user_master_id = get_user_id[0].user_master_id;
            user_permission = get_user_id[0].user_permission;
        }

  if (user_master_id == 1 || user_master_id == 2 || user_master_id == 3) { // primary admin - admin - Dept Head are following this to get the parent id
            logger_all.info("[select query request] : " + `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}' or usr.parent_id in (${user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`);

            var sql_query_2 = await db.query( `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}' or usr.parent_id in (${user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc` );

            logger_all.info("[select query request] : " + JSON.stringify(sql_query_2) );
    // loop all number of available_messages,no of user_ids,no of user_master_id,no of user_name are push in to the arrays.  available then process the will be continued 
  for (var i = 0; i < sql_query_2.length; i++) {
            // total_available_messages.push(sql_query_4[i].available_messages);
            list_user_id += sql_query_2[i].user_id + ",";
            array_list_user_id.push(sql_query_2[i].user_id);
            total_user_id.push(sql_query_2[i].user_id);
            total_user_master_id.push(sql_query_2[i].user_master_id);
            total_user_name.push(sql_query_2[i].user_name);
        }
        list_user_id_1 = list_user_id.slice(0, -1);
            total_available_messages.push(sql_query_2[0].available_messages);
 // loop sql_query_2 length are available then process the will be continued 
            for(var i = 1; i < sql_query_2.length; i++){
// console.log("user_id :" + sql_query_2[i].user_id);
logger_all.info("[select query request] : " + `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${sql_query_2[i].user_id}' or usr.parent_id in (${sql_query_2[i].user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`);
var below_user_ids =await db.query( `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${sql_query_2[i].user_id}' or usr.parent_id in (${sql_query_2[i].user_id})) and usr.usr_mgt_status = 'Y' order by usr.user_master_id, usr.user_id asc`);

logger_all.info("[select query request] : " + JSON.stringify(below_user_ids));
var totalavailableMessages = 0;
// loop below_user_ids length are available then process the will be continued 
for (const user of below_user_ids) {
     totalavailableMessages += user.available_messages;  
  }
  total_available_messages.push(totalavailableMessages);
            }
         
        }
        else { // Agent
            logger_all.info("[select query request] : " + `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}') order by usr.user_master_id, usr.user_id asc`);
            var sql_query_2 = `SELECT usr.user_id, usr.user_name, usr.user_master_id, lmt.available_messages FROM user_management usr left join message_limit lmt on usr.user_id = lmt.user_id where (usr.user_id = '${user_id}') order by usr.user_master_id, usr.user_id asc`;

        }  
         list_user_id_1 = '';
        if (user_permission == 1 || user_permission == 2) {

            if (sql_query_2.length > 0) {
              
                // loop all number of array_list_user_id will available then process the will be continued
                for (var i = 0; i < array_list_user_id.length; i++) {

                    newdb = "whatsapp_report_" + array_list_user_id[i];
                    dashboard_user = ` SELECT "Whatsapp" header_title, wht.user_id, usr.user_name, ums.user_master_id, ums.user_type, ml.available_messages, date(wht.whatsapp_entry_date) entry_date, count(stt.comwtap_status_id) total_msg, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) = date(wht.whatsapp_entry_date)) and response_status = 'S') total_success, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) = date(wht.whatsapp_entry_date)) and response_status = 'F') total_failed, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) = date(wht.whatsapp_entry_date)) and response_status = 'I') total_invalid, (select count(distinct comwtap_status_id) from ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} where (date(comwtap_entry_date) = date(wht.whatsapp_entry_date)) and (response_status not in ('I', 'F', 'S') or response_status is null)) total_waiting FROM ${newdb}.compose_whatsapp_tmpl_${array_list_user_id[i]} wht left join ${newdb}.compose_whatsapp_status_tmpl_${array_list_user_id[i]} stt on wht.compose_whatsapp_id = stt.compose_whatsapp_id left join whatsapp_report.message_limit ml on wht.user_id = ml.user_id left join whatsapp_report.user_management usr left join whatsapp_report.user_master ums on usr.user_master_id = ums.user_master_id on wht.user_id = usr.user_id where wht.user_id = '${array_list_user_id[i]}' and (date(wht.whatsapp_entry_date) BETWEEN '${today_date}' AND '${today_date}')`;

                    logger_all.info("[select query request] : " + dashboard_user + ` group by ums.user_master_id, date(wht.whatsapp_entry_date) order by user_master_id, user_name, entry_date desc `);

                    var dashboard_user_1 = await db.query(dashboard_user + ` group by ums.user_master_id, date(wht.whatsapp_entry_date) order by user_master_id, user_name, entry_date desc `);
                    // if the dashboard_user_1 length is not available to push the my obj datas.otherwise it will be return the push the dashboard_user_1 details.
                    if (dashboard_user_1.length > 0) {
                        total_response.push(dashboard_user_1[0]);
                    }

                    if (dashboard_user_1.length == 0) {

                        var myObj = {
                            "header_title": "Whatsapp",     // push the total response
                            "user_name": total_user_name[i],
                            "user_id": total_user_id[i],
                            "user_master_id": total_user_master_id[i],
                            "available_messages": total_available_messages[i],
                            "total_msg": 0,
                            "total_success": 0,
                            "total_failed": 0,
                            "total_invalid": 0,
                            "total_waiting": 0,

                        }
                        total_response.push(myObj);
                    }
                }

            }
        }
        else { // otherwise
            var myObj = {
                "header_title": "Whatsapp",   // push the total response
                "user_name": total_user_name[0],
                "user_id": total_user_id[0],
                "user_master_id": total_user_master_id[0],
                "available_messages": total_available_messages[0],
                "total_msg": 0,
                "total_success": 0,
                "total_failed": 0,
                "total_invalid": 0,
                "total_waiting": 0,
            }
            total_response.push(myObj);
        }
        // if the get total response length is not available to send the no available data.otherwise it will be return the total_response dashboard today details.
        if (total_response.length > 0) {
            return {
                response_code: 1, response_status: 200, response_msg: 'Success', report: total_response
            };

        } else {

            return { response_code: 1, response_status: 204, response_msg: 'No Data Available' };

        }

    }
    // any error occurres send error response to client
    catch (e) {
        logger_all.info("[DashBoard OTP failed response] : " + e)
        return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
    }
}
// otp_Dash_Board - end

// using for module exporting
module.exports = {
    otp_Dash_Board,

};


