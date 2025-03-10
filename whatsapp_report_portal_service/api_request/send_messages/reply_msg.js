/*
API that allows your frontend to communicate with your backend server (Node.js) for processing and retrieving data.
To access a MySQL database with Node.js and can be use it.
This page is used in reply functions which is used to reply message details.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const db = require("../../db_connect/connect");
const main = require('../../logger')
var util = require('util');
require('dotenv').config()
const env = process.env
const api_url = env.API_URL;
var axios = require('axios');

// replyMsg - start
async function replyMsg(req) {
    try {
        var logger_all = main.logger_all
        //  Get all the req header data
        const header_token = req.headers['authorization'];

        // get all the req data
        let sender_mobile = req.body.sender_mobile;
        let receiver_mobile = req.body.receiver_mobile;
        let reply_msg = req.body.reply_msg;
        // declare the variables
        var err;
        var message_id;
        // to initialize the variable
        let components_json = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": `${receiver_mobile}`,
            "type": "text",
            "text": {
                "body": `${reply_msg}`
            }
        };

        let buff = new Buffer(reply_msg);
        var txt_msg = buff.toString('base64');

        let comp_copy = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": `${receiver_mobile}`,
            "type": "text",
            "text": {
                "body": `${txt_msg}`
            }
        }
        // query parameters
        logger_all.info("[reply msg query parameters] : " + JSON.stringify(req.body));
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
        }
        // if the whatsapp_config_status is 'Y' and to select the sender number
        logger_all.info("[select query request] : " + `SELECT * from whatsapp_config WHERE concat(country_code, mobile_no) = '${sender_mobile}' AND whatspp_config_status = 'Y'`)
        const select_usr_id = await db.query(`SELECT * from whatsapp_config WHERE concat(country_code, mobile_no) = '${sender_mobile}' AND whatspp_config_status = 'Y'`);
        logger_all.info("[select query response] : " + JSON.stringify(select_usr_id))
        // if the select_userid length is not equal to '0' the process will be continued.
        if (select_usr_id.length != 0) {
            // if the messenger_response date is 24 hours to select the select_responsetime
            logger_all.info("[select query request] : " + `SELECT * FROM messenger_response WHERE message_from = '${receiver_mobile}' AND message_to = '${sender_mobile}' AND message_rec_date >= NOW() - INTERVAL 1 DAY`)
            const select_responsetime = await db.query(`SELECT * FROM messenger_response WHERE message_from = '${receiver_mobile}' AND message_to = '${sender_mobile}' AND message_rec_date >= NOW() - INTERVAL 1 DAY`);
            logger_all.info("[select query response] : " + JSON.stringify(select_responsetime))
            // if the select_responsetime length is '0' to send You cannot reply to this number.
            if (select_responsetime.length == 0) {
                err = 'You cannot reply to this number.';
            }
            else { // otherwise the process will be continue

                let buff_name = new Buffer(select_usr_id[0].wht_display_name);
                let profile_name = buff_name.toString('base64');
                // if the new reply message are send to insert the messenger_response
                logger_all.info("[replyMsg - insert query request] : " + `INSERT INTO messenger_response VALUES(NULL,${select_usr_id[0].user_id},'${receiver_mobile}','${sender_mobile}','${profile_name}','-','text','${JSON.stringify(comp_copy)}','${txt_msg}',NULL,NULL,NULL,NULL,NULL,NULL,'N','N',CURRENT_TIMESTAMP,'0000-00-00 00:00:00')`)
                const insert_reply = await db.query(`INSERT INTO messenger_response VALUES(NULL,${select_usr_id[0].user_id},'${receiver_mobile}','${sender_mobile}','${profile_name}','-','text','${JSON.stringify(comp_copy)}','${txt_msg}',NULL,NULL,NULL,NULL,NULL,NULL,'N','N',CURRENT_TIMESTAMP,'0000-00-00 00:00:00')`);
                logger_all.info("[replyMsg - insert query response] : " + JSON.stringify(insert_reply))
                // send reply json
                var reply_msg_json = {
                    method: 'post',
                    url: `${api_url}${select_usr_id[0].phone_number_id}/messages`,
                    headers: {
                        'Authorization': 'Bearer ' + select_usr_id[0].bearer_token,
                    },
                    data: components_json
                };

                logger_all.info("[reply msg  request] : " + JSON.stringify(reply_msg_json))

                await axios(reply_msg_json)
                    .then(async function (response) {

                        logger_all.info("[reply msg response] : " + JSON.stringify(response.data))
                        // to chcek the message_id and update the messenger_response 
                        logger_all.info("[replyMsg - update query request] : " + `UPDATE messenger_response SET message_resp_id = '${response.data.messages[0].id}',message_status = 'Y' WHERE message_id = ${insert_reply.insertId}`)
                        const update_success = await db.query(`UPDATE messenger_response SET message_resp_id = '${response.data.messages[0].id}',message_status = 'Y' WHERE message_id = ${insert_reply.insertId}`);
                        logger_all.info("[replyMsg - update query response] : " + JSON.stringify(update_success))

                        message_id = response.data.messages[0].id;
                        // return { response_code: 1, response_status: 200, response_msg: 'Success' };

                    })
                    // if the message response is failed and any error are occured to the catch function
                    .catch(async function (error) {
                        logger_all.info("[reply msg failed response] : " + error)
                        // to chcek the message_id and update the messenger_response so update the failed status
                        logger_all.info("[replyMsg - update query request] : " + `UPDATE messenger_response SET message_status = 'F' WHERE message_id = ${insert_reply.insertId}`)
                        const update_failure = await db.query(`UPDATE messenger_response SET message_status = 'F' WHERE message_id = ${insert_reply.insertId}`);
                        logger_all.info("[replyMsg - update query response] : " + JSON.stringify(update_failure))

                        err = 'Error Occurred.';

                        // return { response_code: 0, response_status: 201, response_msg: 'Error occurred ' };

                    })
            }
        }
        else { // otherwise No sender ID found.
            err = 'No sender ID found.';
            // return { response_code: 0, response_status: 201, response_msg: 'No sener ID found.' };
        }

        if (err) {//if any error are occurred to execute the this condition 
            return { response_code: 0, response_status: 201, response_msg: err };
        }
        else { //otherwise to send the success message and message_id
            return { response_code: 1, response_status: 200, response_msg: 'Success', message_id: message_id };
        }
    }
    catch (e) {// any error occurres send error response to client
        logger_all.info("[reply msg failed response] : " + e)
        return { response_code: 0, response_status: 201, response_msg: 'Error occurred ' };
    }
}
// replyMsg - end

// using for module exporting
module.exports = {
    replyMsg
};

