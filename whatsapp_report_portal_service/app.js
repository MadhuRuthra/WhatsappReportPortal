/*
API that allows your frontend to communicate with your backend server (Node.js) for processing and retrieving data.
To access a MySQL database with Node.js and can be use it.
This is a main page for starting API the process.This page to routing the subpages page and then process are executed.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 05-Jul-2023
*/
// Import the required packages and libraries
const https = require("https");
const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
// const router = express.Router();
var cors = require("cors");
var axios = require('axios');
// const csv = require("csv-stringify");
const fse = require('fs-extra');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');

const mime = require('mime');
// Database Connections
const app = express();
const port = 10017;
const db = require("./db_connect/connect");
const dynamic_db = require("./db_connect/dynamic_connect");

const validator = require('./validation/middleware')

const bodyParser = require('body-parser');
const fs = require('fs');
const log_file = require('./logger')
const logger = log_file.logger;
const logger_all = log_file.logger_all;


const httpServer = https.createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: "*",
	},
});

// Process Validations
const bigqueryValidation = require("./validation/big_query_validation");
const composeMsgValidation = require("./validation/send_message_validation");
const createTemplateValidation = require("./validation/template_approval_validation");
const UserApprovalValidation = require("./validation/user_approval_validation");
const CreateCsvValidation = require("./validation/create_csv_validation");

const Logout = require("./logout/route");
const Login = require("./login/route");
const Template = require("./api_request/template/template_route");
const Message = require("./api_request/send_messages/send_message_route");
const Report = require("./api_request/report/report_route");
const List = require("./api_request/list/list_route");
const SenderId = require("./api_request/sender_id/sender_id_route");
const Chat = require("./api_request/chat/chat_route");
const DeviceId = require("./api_request/update_device_token/route_devicetoken");
const valid_user = require("./validation/valid_user_middleware");
const Upload = require("./api_request/upload/upload_route");
const dashboard = require("./api_request/dashboard/dashboard_route");
const getHeaderFile = require('./api_request/template/getHeader');

const testing = require('./api_request/testing/testing_route');
const env = process.env

const api_url = env.API_URL;
const media_bearer = env.MEDIA_BEARER;
const media_storage = env.MEDIA_STORAGE;

// Current Date and Time
// var today = new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"});
var day = new Date();

// Log file Generation based on the current date
var util = require('util');
var exec = require('child_process').exec;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
	express.urlencoded({
		extended: true,
		limit: '50mb'
	})
);

// Allows you to send emits from express
app.use(function (request, response, next) {
	request.io = io;
	next();
});

app.get("/", async (req, res) => {
	console.log(day)
	res.json({ message: "okkkk" });
});
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// API initialzation
app.use("/login", Login);
app.use("/template", Template);
app.use("/message", Message);
app.use("/report", Report);
app.use("/list", List);
app.use("/sender_id", SenderId);
app.use("/chat", Chat);
app.use("/devicetoken", DeviceId);
app.use("/logout", Logout);
app.use("/upload_media", Upload);
app.use("/dashboard", dashboard);

app.use("/test", testing);

// api for create a template
app.post("/create_template", validator.body(createTemplateValidation),
	valid_user, async (req, res) => {

		try {
			const logger_all = log_file.logger_all;

			var header_json = req.headers;
			let ip_address = header_json['x-forwarded-for'];

			// get current_year to generate a template name
			var current_year = day.getFullYear().toString();

			// get today's julian date to generate template name
			Date.prototype.julianDate = function () {
				var j = parseInt((this.getTime() - new Date('Dec 30,' + (this.getFullYear() - 1) + ' 23:00:00').getTime()) / 86400000).toString(),
					i = 3 - j.length;
				while (i-- > 0) j = 0 + j;
				return j
			};

			// get all the data from the api body and headers
			let api_bearer = req.headers.authorization;
			let language = req.body.language;
			let temp_category = req.body.category;
			let temp_components = req.body.components;
			let temp_details = req.body.code;
			let media_url = req.body.media_url;
			let mediatype = req.body.mediatype;

			//  initialize required variable and arrays.
			var succ_array = [];
			var error_array = [];
			var user_id, media_type;
			var variable_count = 0;
			var user_short_name;
			var full_short_name;
			var user_master;
			var unique_id;
			var media_types;

			const insert_api_log = `INSERT INTO api_log VALUES(NULL,'${req.originalUrl}','${ip_address}','${req.body.request_id}','N','-','0000-00-00 00:00:00','Y',CURRENT_TIMESTAMP)`
			logger_all.info("[insert query request] : " + insert_api_log);
			const insert_api_log_result = await db.query(insert_api_log);
			logger_all.info("[insert query response] : " + JSON.stringify(insert_api_log_result))

			const check_req_id = `SELECT * FROM api_log WHERE request_id = '${req.body.request_id}' AND response_status != 'N' AND log_status='Y'`
			logger_all.info("[select query request] : " + check_req_id);
			const check_req_id_result = await db.query(check_req_id);
			logger_all.info("[select query response] : " + JSON.stringify(check_req_id_result));

			if (check_req_id_result.length != 0) {

				logger_all.info("[failed response] : Request already processed");
				logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

			}

			// if req.body contains user_id we are checking both user_id and bearer token are valid and store some information like short_name for generate a template name
			if (req.body.user_id) {
				user_id = req.body.user_id;
				logger_all.info("[select query request] : " + `SELECT * FROM user_management WHERE bearer_token = '${api_bearer}' AND user_id = '${user_id}'`)
				const get_user_id = await db.query(`SELECT * FROM user_management WHERE bearer_token = '${api_bearer}' AND user_id = '${user_id}'`);
				logger_all.info("[select query response] : " + JSON.stringify(get_user_id))
				user_short_name = get_user_id[0].user_short_name;
				user_master = get_user_id[0].parent_id;

			}
			else {
				// if user_id not received in req.body we will get if using bearer token.
				logger_all.info("[select query request] : " + `SELECT * FROM user_management WHERE bearer_token = '${api_bearer}' AND usr_mgt_status = 'Y'`)
				const get_user_id = await db.query(`SELECT * FROM user_management WHERE bearer_token = '${api_bearer}' AND usr_mgt_status = 'Y'`);
				logger_all.info("[select query response] : " + JSON.stringify(get_user_id))

				user_id = get_user_id[0].user_id;
				user_short_name = get_user_id[0].user_short_name;
				user_master = get_user_id[0].parent_id;
			}

			// get the given user's master short name 
			logger_all.info("[select query request] : " + `SELECT usr1.user_short_name FROM user_management usr
			LEFT JOIN user_management usr1 on usr.parent_id = usr1.user_id
			WHERE usr.user_short_name = '${user_short_name}'`)
			const get_user_short_name = await db.query(`SELECT usr1.user_short_name FROM user_management usr
			LEFT JOIN user_management usr1 on usr.parent_id = usr1.user_id
			WHERE usr.user_short_name = '${user_short_name}'`);
			logger_all.info("[select query response] : " + JSON.stringify(get_user_short_name))

			// if nothing returns set given user's short_name as full_short_name
			if (get_user_short_name.length == 0) {
				full_short_name = user_short_name;
			}
			else {
				// if the given user is primary admin then no master shouldn't be there. so set given user's short_name as full_short_name
				if (user_master == 1 || user_master == '1') {
					full_short_name = user_short_name;
				}
				// concat the given user's master short_name in given user's short_name
				else {
					full_short_name = `${get_user_short_name[0].user_short_name}_${user_short_name}`;
				}
			}

			// get the unique_serial_number to generate unique template name
			logger_all.info("[select query request] : " + `SELECT unique_template_id FROM message_template ORDER BY template_id DESC limit 1`)
			const get_unique_id = await db.query(`SELECT unique_template_id FROM message_template ORDER BY template_id DESC limit 1`);
			logger_all.info("[select query response] : " + JSON.stringify(get_unique_id))

			// if nothing returns this is going to be a first template so make it as 001
			if (get_unique_id.length == 0) {
				unique_id = '001'
			}
			else {
				// get the serial_number of the latest template
				var serial_id = get_unique_id[0].unique_template_id.substr(get_unique_id[0].unique_template_id.length - 3)
				var temp_id = parseInt(serial_id) + 1;

				// add 0 as per our need
				if (temp_id.toString().length == 1) {
					unique_id = '00' + temp_id;
				}
				if (temp_id.toString().length == 2) {
					unique_id = '0' + temp_id;
				}
				if (temp_id.toString().length == 3) {
					unique_id = temp_id;
				}
			}

			var tmp_details;
			var tmp_details_test;

			const usedCampaignIds = new Set();

			function generateCampaignId() {
				const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
				let campaignId;

				do {
					campaignId = '';
					for (let i = 0; i < 10; i++) {
						const randomIndex = Math.floor(Math.random() * characters.length);
						campaignId += characters.charAt(randomIndex);
					}
				} while (usedCampaignIds.has(campaignId));

				usedCampaignIds.add(campaignId);

				// Add any additional formatting if needed
				return campaignId;
			}

			// Example usage:
			const template_id = generateCampaignId();
			console.log(template_id); // Output: A2B8X9D4Y1

			// check the template code is received to make the pld code work
			if (!temp_details) {

				// initialize the code 
				tmp_details = '000000000';

				// function to set the character ina string at a specific position
				function setCharAt(index, chr) {
					if (index > tmp_details.length - 1) return tmp_details;
					tmp_details = tmp_details.substring(0, index) + chr + tmp_details.substring(index + 1);
					return tmp_details.substring(0, index) + chr + tmp_details.substring(index + 1);
				}

				// check the template have english text or other language, media or not, buttons - to validate the template have all of the components as mentioned in the template_code.
				// if it is not same, then something is missing we send a error response to client
				for (var p = 0; p < temp_components.length; p++) {

					// check the body have variables and the template language is english or not
					if (temp_components[p]['type'] == 'body' || temp_components[p]['type'] == 'BODY') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						if (temp_components[p]['example']) {
							variable_count = temp_components[p]['example']['body_text'][0].length
						}
						if (language == 'en_US' || language == 'en_GB') {
							setCharAt(0, "t");
						}
						else {
							setCharAt(0, "l");
						}
					}

					// check the header has text
					if (temp_components[p]['type'] == 'HEADER') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						setCharAt(1, "h");
					}

					// check the template has footer
					if (temp_components[p]['type'] == 'FOOTER') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						setCharAt(8, "f");
					}

					// check the template has button, and which type of buttons they have.
					if (temp_components[p]['type'] == 'BUTTONS') {
						for (var b = 0; b < temp_components[p]['buttons'].length; b++) {
							if (temp_components[p]['buttons'][b]['type'] == 'URL') {
								setCharAt(6, "u");
							}
							if (temp_components[p]['buttons'][b]['type'] == 'QUICK_REPLY') {
								setCharAt(7, "r");
							}

							if (temp_components[p]['buttons'][b]['type'] == 'PHONE_NUMBER') {
								setCharAt(5, "c");
							}
						}
					}
					// check the template has which type of media
					if (media_url && temp_details) {
						//h_file = await getHeaderFile.getHeaderFile(media_url);
						if (temp_details.charAt(2) == 'i') {
							setCharAt(2, "i");
							media_type = 'IMAGE'
							media_types = 'IMAGE'
						}

						else if (temp_details.charAt(3) == 'v') {
							setCharAt(3, "v");
							media_type = 'VIDEO'
							media_types = 'VIDEO'
						}

						else if (temp_details.charAt(4) == 'd') {
							setCharAt(4, "d");
							media_type = 'DOCUMENT'
							media_types = 'DOCUMENT'
						}

					}
				}
			}
			// this block doing the same work as the previos block
			else {
				tmp_details_test = '000000000';
				function setCharAtTest(index, chr) {
					if (index > tmp_details_test.length - 1) return tmp_details_test;
					tmp_details_test = tmp_details_test.substring(0, index) + chr + tmp_details_test.substring(index + 1);
					return tmp_details_test.substring(0, index) + chr + tmp_details_test.substring(index + 1);
				}

				for (var p = 0; p < temp_components.length; p++) {
					if (temp_components[p]['type'] == 'body' || temp_components[p]['type'] == 'BODY') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						if (temp_components[p]['example']) {
							variable_count = temp_components[p]['example']['body_text'][0].length
						}
						if (language == 'en_US' || language == 'en_GB') {
							setCharAtTest(0, "t");
						}
						else {
							setCharAtTest(0, "l");
						}

					}

					if (temp_components[p]['type'] == 'HEADER') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						setCharAtTest(1, "h");
					}

					if (temp_components[p]['type'] == 'FOOTER') {
						temp_components[p]['text'] = temp_components[p]['text'].replace(/&amp;/g, "&")
						setCharAtTest(8, "f");
					}
					if (temp_components[p]['type'] == 'BUTTONS') {
						for (var b = 0; b < temp_components[p]['buttons'].length; b++) {
							if (temp_components[p]['buttons'][b]['type'] == 'URL') {
								setCharAtTest(6, "u");
							}
							if (temp_components[p]['buttons'][b]['type'] == 'QUICK_REPLY') {
								setCharAtTest(7, "r");
							}

							if (temp_components[p]['buttons'][b]['type'] == 'PHONE_NUMBER') {
								setCharAtTest(5, "c");
							}

						}

					}
				}

				// if media found in the component
				if (media_type) {
					// if media type found but media url not in request media is required. so we send error response to the client
					if (!media_url) {
						logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Mismatch code', request_id: req.body.request_id }))

						var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Mismatch code' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
						logger.silly("[update query request] : " + log_update);
						const log_update_result = await db.query(log_update);
						logger.silly("[update query response] : " + JSON.stringify(log_update_result))

						return res.json({ response_code: 0, response_status: 201, response_msg: 'Mismatch code', request_id: req.body.request_id });
					}
					// if media_url is in the request
					else {

					}
				}

				else {

				}



				// if everything fine assign the recieved template code in one variable
				tmp_details = temp_details;
			}


			// generate unique template name 
			let temp_name = `te_${full_short_name}_${tmp_details}_${current_year.substring(2)}${day.getMonth() + 1}${day.getDate()}_${unique_id}`;
			let unique_template_id = `tmplt_${full_short_name}_${new Date().julianDate()}_${unique_id}`;


			// check if the language is in our db 
			logger_all.info("[select query request] : " + `SELECT * from master_language WHERE language_code = '${language}' AND language_status = 'Y'`)
			const select_lang = await db.query(`SELECT * from master_language WHERE language_code = '${language}' AND language_status = 'Y'`);
			logger_all.info("[select query response] : " + JSON.stringify(select_lang))

			if (select_lang.length != 0) {
				var msg_tmp = `INSERT INTO message_template VALUES(NULL,'-','${unique_template_id}','${temp_name}',${select_lang[0].language_id},'${temp_category}',?,?,'${user_id}','N',CURRENT_TIMESTAMP,'0000-00-00 00:00:00','${variable_count}',NULL, ${mediatype ? `'${mediatype}'` : 'NULL'} , '${template_id}')`;
				// get the whatsapp business id, bearer token for the sender number from db
				logger_all.info("[insert query request] : " + msg_tmp);

				const insert_template = await db.query(msg_tmp, [JSON.stringify(temp_components), '-']);


				// Get the last insert ID
				const last_template_id = insert_template.insertId;
				logger_all.info("Last insert ID: " + last_template_id);
				var user_name_get = await dynamic_db.query(`SELECT user_name from whatsapp_report.user_management WHERE user_id = ${user_id}`);
				var user_name = user_name_get[0].user_name;


				logger_all.info("[insert query response] : " + JSON.stringify(insert_template));
				var log_update = `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))
				res.json({ response_code: 1, response_status: 200, response_msg: 'Success ', success: succ_array, failure: error_array, request_id: req.body.request_id });


				let transporter = nodemailer.createTransport({
					// Configure your email service here (SMTP, Gmail, etc.)
					service: 'gmail',
					auth: {
						user: 'suhasini.r@yeejai.com', // Your email address
						pass: 'cicauzxsnivlvhvs' // Your email password or app-specific password
					}
				});

				// Define email options
				let mailOptions = {
					from: 'suhasini.r@yeejai.com', // Sender's email address and name
					to: 'Vinod@celebdigital.in, Sunil@celebdigital.in, tech@yeejai.com', // Recipient's email addresses separated by commas
					subject: 'Alert: WTSP - Template Created by User', // Email subject
					text: `Below Template Details:\n\nUser: ${user_name}\nTemplate ID: ${last_template_id}\nTemplate Name: ${temp_name}`
					// html: '<p>This is the HTML version of the email.</p>' // HTML body
				};

				// Send email
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log('Error occurred:', error);
					}
					console.log('Email sent:', info.response);
				});
			}
			else {
				logger_all.info("[template approval failed number] :   language not available in DB")
				error_array.push({ reason: 'Language not available' })

			}


		}
		catch (e) {
			logger_all.info(e);
			// if error occurred send error response to the client
			logger_all.info("[template approval failed response] : " + e)
			logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Error occurred ', success: succ_array, failure: error_array, request_id: req.body.request_id }))

			var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Error occurred' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
			logger.silly("[update query request] : " + log_update);
			const log_update_result = await db.query(log_update);
			logger.silly("[update query response] : " + JSON.stringify(log_update_result))

			res.json({ response_code: 0, response_status: 201, response_msg: 'Error occurred ', success: succ_array, failure: error_array, request_id: req.body.request_id });

		}
	});

// api for to send compose_whatsapp_message
app.post("/compose_whatsapp_message", validator.body(composeMsgValidation),
	valid_user, async (req, res) => {
		try {

			var header_json = req.headers;
			let ip_address = header_json['x-forwarded-for'];

			// var senders = req.body.sender_numbers;
			var mobiles = req.body.receiver_numbers;
			var api_bearer = req.headers.authorization;
			var template_id = req.body.template_id;
			var file_location = req.body.file_location;
			var template_name = req.body.template_name;
			var total_mobileno_count = req.body.total_mobileno_count;
			var link = req.body.link;
			var message_type = req.body.message_type;
			var parts = template_name.split('_');
			var substring = parts[2];
			var substring_image = substring[2]; // Character at index 2 (3rd position)
			var substring_video = substring[3]; // Character at index 3 (4th position)
			var substring_document = substring[4]; //
			var tmpl_name, whtsap_send, tmpl_lang;


			// declare and initialize all the required variables and array
			var user_id, store_id, full_short_name, user_master, template_variable_count;


			const insert_api_log = `INSERT INTO api_log VALUES(NULL,'${req.originalUrl}','${ip_address}','${req.body.request_id}','N','-','0000-00-00 00:00:00','Y',CURRENT_TIMESTAMP)`
			logger_all.info("[insert query request] : " + insert_api_log);
			const insert_api_log_result = await db.query(insert_api_log);
			logger_all.info("[insert query response] : " + JSON.stringify(insert_api_log_result))

			const check_req_id = `SELECT * FROM api_log WHERE request_id = '${req.body.request_id}' AND response_status != 'N' AND log_status='Y'`
			logger_all.info("[select query request] : " + check_req_id);
			const check_req_id_result = await db.query(check_req_id);
			logger_all.info("[select query response] : " + JSON.stringify(check_req_id_result));

			if (check_req_id_result.length != 0) {

				logger_all.info("[failed response] : Request already processed");
				logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

			}

			// get the available creidts of the user
			logger_all.info("[select query request] : " + `SELECT lim.available_messages,usr.user_id,usr.user_short_name,usr.parent_id FROM user_management usr
		LEFT JOIN message_limit lim ON lim.user_id = usr.user_id
		WHERE usr.bearer_token = '${api_bearer}' AND usr.usr_mgt_status = 'Y'`)

			const check_available_credits = await db.query(`SELECT usr.user_master_id,lim.available_messages,usr.user_id,usr.user_short_name,usr.parent_id FROM user_management usr
		LEFT JOIN message_limit lim ON lim.user_id = usr.user_id
		WHERE usr.bearer_token = '${api_bearer}' AND usr.usr_mgt_status = 'Y'`);
			logger_all.info("[select query response] : " + JSON.stringify(check_available_credits))

			// if credits is less than numbers of message to send then process will continued otherwise send a error response to the client
			if (check_available_credits[0].available_messages < total_mobileno_count) {
				logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Available credit not enough.', request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Available credit not enough' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				return res.json({ response_code: 0, response_status: 201, response_msg: 'Available credit not enough.', request_id: req.body.request_id });
			}


			// get the user_id, user's parent id and user shortname to generate campaign name
			user_id = check_available_credits[0].user_id;
			user_master = check_available_credits[0].parent_id;
			var user_master_id = check_available_credits[0].user_master_id;
			var user_short_name = check_available_credits[0].user_short_name;

			if (total_mobileno_count < 100 && user_master_id != 1) {
				return res.json({ response_code: 0, response_status: 201, response_msg: 'Campaign should have atleast 100 numbers.' });
			}

			// get the given user's master short name
			logger_all.info("[select query request] : " + `SELECT usr1.user_short_name FROM user_management usr
		LEFT JOIN user_management usr1 on usr.parent_id = usr1.user_id
		WHERE usr.user_short_name = '${user_short_name}'`)
			const get_user_short_name = await db.query(`SELECT usr1.user_short_name FROM user_management usr
		LEFT JOIN user_management usr1 on usr.parent_id = usr1.user_id
		WHERE usr.user_short_name = '${user_short_name}'`);
			logger_all.info("[select query response] : " + JSON.stringify(get_user_short_name))

			// if nothing returns set given user's short_name as full_short_name
			if (get_user_short_name.length == 0) {
				full_short_name = user_short_name;
			}
			else {
				// if the given user is primary admin then no master shouldn't be there. so set given user's short_name as full_short_name
				if (user_master == 1 || user_master == '1') {
					full_short_name = user_short_name;
				}
				// concat the given user's master short_name in given user's short_name
				else {
					full_short_name = `${get_user_short_name[0].user_short_name}_${user_short_name}`;
				}
			}

			// check if the template is available
			logger_all.info("[select query request] : " + `SELECT * FROM message_template tmp
		LEFT JOIN master_language lan ON lan.language_id = tmp.language_id
		WHERE tmp.unique_template_id = '${template_id}' AND tmp.template_status = 'Y'`)
			const check_variable_count = await db.query(`SELECT * FROM message_template tmp
		LEFT JOIN master_language lan ON lan.language_id = tmp.language_id
		WHERE tmp.unique_template_id = '${template_id}' AND tmp.template_status = 'Y'`);
			logger_all.info("[select query response] : " + JSON.stringify(check_variable_count))

			// if template not available send error response to the client
			if (check_variable_count.length == 0) {
				logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'template not available', request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Template not available' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				return res.json({ response_code: 0, response_status: 201, response_msg: 'template not available', request_id: req.body.request_id });
			}
			// if template available process will be continued
			else {
				whtsap_send = check_variable_count[0].template_message;
				unique_template_id = check_variable_count[0].unique_template_id;
				template_variable_count = check_variable_count[0].variable_values_count;
				// get the template name and language from template id
				tmpl_name = check_variable_count[0].template_name;
				tmpl_lang = check_variable_count[0].language_code;

				try {
					// get the template json from db to check the template has media and variables
					var replced_message = check_variable_count[0].template_message.replace(/(\r\n|\n|\r)/gm, " ");
					var tmpl_message = JSON.parse(replced_message);
					// assign 0 and 1  value as 0 to check the media
					var get_temp_details = [0, 0];

					// loop the template json to check the template has media
					for (var t = 0; t < tmpl_message.length; t++) {
						// check if the template has image if yes set 2nd index value as i
						if (tmpl_message[t].type.toLowerCase() == 'header' && tmpl_message[t].format.toLowerCase() == 'image') {
							get_temp_details[2] = 'i';
							get_temp_details[3] = 0;
							get_temp_details[4] = 0;
						}
						// check if the template has video if yes set 3rd index value as v
						else if (tmpl_message[t].type.toLowerCase() == 'header' && tmpl_message[t].format.toLowerCase() == 'video') {
							get_temp_details[2] = 0;
							get_temp_details[3] = 'v';
							get_temp_details[4] = 0;
						}
						// check if the template has document if yes set 4th index value as d
						else if (tmpl_message[t].type.toLowerCase() == 'header' && tmpl_message[t].format.toLowerCase() == 'document') {
							get_temp_details[2] = 0;
							get_temp_details[3] = 0;
							get_temp_details[4] = 'd';
						}
						// if template doesn't have any media then set 2,3,4 index as 0
						else {
							get_temp_details[2] = 0;
							get_temp_details[3] = 0;
							get_temp_details[4] = 0;
						}
					}

					if (get_temp_details.length != 0) {
						// check if 2,3,4 is not 0. If these 3 index values are 0 then no media for this template
						if (get_temp_details[2] != 0 || get_temp_details[3] != 0 || get_temp_details[4] != 0) {

							// flag to check the request have media
							var media_flag = false;

							// loop the received json have media 
							for (var p = 0; p < whtsap_send.length; p++) {
								if (whtsap_send[p]['type'] == 'header' || whtsap_send[p]['type'] == 'HEADER') {
									// check the request have image
									if (get_temp_details[2] != 0) {
										if ((whtsap_send[p]['parameters'][0]['type'] == 'image' || whtsap_send[p]['parameters'][0]['type'] == 'IMAGE') && get_temp_details[2] != 0) {
											media_flag = true;
										}
										else { // Otherwise to send the  response message in 'Image required for this template' to the user
											logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Image required for this template', request_id: req.body.request_id }))

											var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Image required for this template' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
											logger.silly("[update query request] : " + log_update);
											const log_update_result = await db.query(log_update);
											logger.silly("[update query response] : " + JSON.stringify(log_update_result))

											return res.json({ response_code: 0, response_status: 201, response_msg: 'Image required for this template', request_id: req.body.request_id });
										}
									}
									// check the request have video
									else if (get_temp_details[3] != 0) {
										if ((whtsap_send[p]['parameters'][0]['type'] == 'video' || whtsap_send[p]['parameters'][0]['type'] == 'VIDEO') && get_temp_details[3] != 0) {
											media_flag = true;
										}
										else {// Otherwise to send the  response message in 'Video required for this template' to the user
											logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Video required for this template', request_id: req.body.request_id }))

											var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Video required for this template' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
											logger.silly("[update query request] : " + log_update);
											const log_update_result = await db.query(log_update);
											logger.silly("[update query response] : " + JSON.stringify(log_update_result))

											return res.json({ response_code: 0, response_status: 201, response_msg: 'Video required for this template', request_id: req.body.request_id });
										}
									}

									// check the request have document
									else if (get_temp_details[4] != 0) {
										if ((whtsap_send[p]['parameters'][0]['type'] == 'document' || whtsap_send[p]['parameters'][0]['type'] == 'DOCUMENT') && get_temp_details[4] != 0) {
											media_flag = true;
										}
										else {// Otherwise to send the  response message in 'Document required for this template' to the user
											logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Document required for this template', request_id: req.body.request_id }))

											var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Document required for this template' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
											logger.silly("[update query request] : " + log_update);
											const log_update_result = await db.query(log_update);
											logger.silly("[update query response] : " + JSON.stringify(log_update_result))

											return res.json({ response_code: 0, response_status: 201, response_msg: 'Document required for this template', request_id: req.body.request_id });
										}
									}
								}
							}
						}
					}
				}
				catch (e) { // any error occurres send error response to client
					logger_all.info("[media check error] : " + e)
				}

				// check how many variables the template have
				// if (check_variable_count[0].body_variable_count > 0) {
				// 	console.log("Coming 1");
				// 	if (inner_variable[0] === 0) {
				// 		logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Variable values required', request_id: req.body.request_id }));
				// 		var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Variable values required' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`;
				// 		logger.silly("[update query request] : " + log_update);
				// 		const log_update_result = await db.query(log_update);
				// 		logger.silly("[update query response] : " + JSON.stringify(log_update_result));
				// 		return res.json({ response_code: 0, response_status: 201, response_msg: 'Variable values required', request_id: req.body.request_id });
				// 	}
				// }

				// check how many variables the template have
				// if (substring_image == 'i' || substring_video == 'v' || substring_document == 'd') {
				// 	console.log("Coming 1");
				// 	if (media_values.length === 0) {
				// 		logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Variable values required', request_id: req.body.request_id }));
				// 		var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Variable values required' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`;
				// 		logger.silly("[update query request] : " + log_update);
				// 		const log_update_result = await db.query(log_update);
				// 		logger.silly("[update query response] : " + JSON.stringify(log_update_result));
				// 		return res.json({ response_code: 0, response_status: 201, response_msg: 'Media values required', request_id: req.body.request_id });
				// 	}
				// }

				// if request have store_id, store id will be received store id value
				if (req.body.store_id) {
					store_id = req.body.store_id;
				}
				// otherwise store id will be 0
				else {
					store_id = 0;
				}


				// get today's julian date to generate compose_unique_name
				Date.prototype.julianDate = function () {
					var j = parseInt((this.getTime() - new Date('Dec 30,' + (this.getFullYear() - 1) + ' 23:00:00').getTime()) / 86400000).toString(),
						i = 3 - j.length;
					while (i-- > 0) j = 0 + j;
					return j
				};

				// declare db name and tables_name
				var db_name = `whatsapp_report_${user_id}`;
				var table_names = [`compose_whatsapp_tmpl_${user_id}`, `compose_whatsapp_status_tmpl_${user_id}`, `whatsapp_text_${user_id}`];
				var compose_whatsapp_id;
				var compose_unique_name;

				logger_all.info("[select query request] : " + `SELECT compose_whatsapp_id from ${table_names[0]} ORDER BY compose_whatsapp_id desc limit 1`)
				const select_compose_id = await dynamic_db.query(`SELECT compose_whatsapp_id from ${table_names[0]} ORDER BY compose_whatsapp_id desc limit 1`, null, `${db_name}`);
				logger_all.info("[select query response] : " + JSON.stringify(select_compose_id))
				// To select the select_compose_id length is '0' to create the compose unique name 
				if (select_compose_id.length == 0) {
					compose_unique_name = `ca_${full_short_name}_${new Date().julianDate()}_1`;
				}

				else { // Otherwise to get the select_compose_id using
					compose_unique_name = `ca_${full_short_name}_${new Date().julianDate()}_${select_compose_id[0].compose_whatsapp_id + 1}`;
				}

				const usedCampaignIds = new Set();

				function generateCampaignId() {
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
					let campaignId;

					do {
						campaignId = '';
						for (let i = 0; i < 10; i++) {
							const randomIndex = Math.floor(Math.random() * characters.length);
							campaignId += characters.charAt(randomIndex);
						}
					} while (usedCampaignIds.has(campaignId));

					usedCampaignIds.add(campaignId);

					// Add any additional formatting if needed
					return campaignId;
				}

				// Example usage:
				const campaign_id = generateCampaignId();
				console.log(campaign_id); // Output: P9C2M4T5F6


				var insert_msg;

				// if (substring_image == 'i' || substring_video == 'v' || substring_document == 'd') {
				// 	var insert_msg = `INSERT INTO ${table_names[0]} VALUES(NULL,'${user_id}','${store_id}','1','-','-','-', '[]','${tmpl_name}','TEXT','${total_mobileno_count}','1','${total_mobileno_count}','${compose_unique_name}','${campaign_id}',NULL,'${unique_template_id}', NULL ,'W',CURRENT_TIMESTAMP,${link ? "'" + link + "'" : 'NULL'},NULL,NULL, NULL,'${file_location}')`;
				// }
				// else {
				var insert_msg = `INSERT INTO ${table_names[0]} VALUES(NULL,'${user_id}','${store_id}','1','-','-','[]','[]', '${tmpl_name}','TEXT','${total_mobileno_count}','1','${total_mobileno_count}','${compose_unique_name}','${campaign_id}',NULL,'${unique_template_id}', NULL ,'W',CURRENT_TIMESTAMP,${link ? "'" + link + "'" : 'NULL'},NULL,NULL, NULL,'${file_location}')`;
				// }


				logger_all.info("[insert query request] : " + insert_msg);
				const insert_compose = await dynamic_db.query(insert_msg, null, `${db_name}`);
				logger_all.info("[insert query response] : " + JSON.stringify(insert_compose))


				// Get the last insert ID
				const last_compose_id = insert_compose.insertId;
				logger_all.info("Last insert ID: " + last_compose_id);


				var user_name_get = await dynamic_db.query(`SELECT user_name from whatsapp_report.user_management WHERE user_id = ${user_id}`);
				var user_name = user_name_get[0].user_name;
				var template_name_get = await dynamic_db.query(`SELECT templateid,template_id, template_name from whatsapp_report.message_template WHERE unique_template_id = '${unique_template_id}'`);
				var template_name = template_name_get[0].template_name;
				var tem_id = template_name_get[0].templateid;


				var insert_main_com = `INSERT INTO master_compose_whatsapp VALUES(NULL,'${last_compose_id}','${user_id}','${total_mobileno_count}','${compose_unique_name}','${campaign_id}','${template_name}', '${tem_id}', NULL,NULL, 0,0,0,0,0,'W',CURRENT_TIMESTAMP,NULL,NULL)`;
				logger_all.info("[insert query request] : " + insert_main_com);
				const insert_main_com_result = await db.query(insert_main_com)
				logger_all.info("[insert_main_com response] : " + JSON.stringify(insert_main_com_result))

				// Execute the update query outside the loop
				var message_update = `UPDATE message_limit SET available_messages = available_messages - ${total_mobileno_count} WHERE user_id = '${user_id}'`;
				logger_all.info(" [update query request] : " + message_update);
				const increase_limit = await db.query(message_update);
				logger_all.info(" [update query response] : " + JSON.stringify(increase_limit));

				logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 1, response_status: 200, response_msg: 'Initiated', compose_id: compose_unique_name, request_id: req.body.request_id }))

				let transporter = nodemailer.createTransport({
					  // Configure your email service here (SMTP, Gmail, etc.)
					  service: 'gmail',
					  auth: {
						  user: 'suhasini.r@yeejai.com', // Your email address
						  pass: 'cicauzxsnivlvhvs' // Your email password or app-specific password
					  }
				});

				// Define email options
				let mailOptions = {
					  from: 'suhasini.r@yeejai.com', // Sender's email address and name
					  to: 'Vinod@celebdigital.in, Sunil@celebdigital.in, tech@yeejai.com', // Recipient's email addresses separated by commas
					  subject: 'Alert: WTSP - Campaign Created by User', // Email subject
					  text: `Below Campaign Details:\n\nUser: ${user_name}\nCampaign ID: ${last_compose_id}\nCampaign Name: ${compose_unique_name}\nTemplate ID: ${tem_id}\nTemplate Name: ${template_name}\nTotal Count: ${total_mobileno_count}` // Plain text body
					  // html: '<p>This is the HTML version of the email.</p>' // HTML body
				 };

				 // Send email
				transporter.sendMail(mailOptions, (error, info) => {
					  if (error) {
						  return console.log('Error occurred:', error);
					  }
					  console.log('Email sent:', info.response);
				});

				var insert_summary = `INSERT INTO user_summary_report VALUES(NULL,'${user_id}','${last_compose_id}','${compose_unique_name}','${campaign_id}','${total_mobileno_count}','${total_mobileno_count}',0, 0, 0, 0, 0, "N", "N", CURRENT_TIMESTAMP, NULL, NULL)`;

				logger_all.info("[insert query request] : " + insert_summary);
				const insert_summary1 = await db.query(insert_summary);
				logger_all.info("[insert query response] : " + JSON.stringify(insert_summary1))


				var log_update = `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);

				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result));

				res.json({ response_code: 1, response_status: 200, response_msg: 'Initiated', compose_id: compose_unique_name, request_id: req.body.request_id });
			}
		}
		catch (e) {// any error occurres send error response to client
			logger_all.info("[Send msg failed response] : " + e)
		}
	});

// to api for create_csv 
app.post('/create_csv', validator.body(CreateCsvValidation),
	valid_user, async function (req, res) {

		try {
			var header_json = req.headers;
			let ip_address = header_json['x-forwarded-for'];

			// to get date and time
			var day = new Date();
			var today_date = day.getFullYear() + '' + (day.getMonth() + 1) + '' + day.getDate();
			var today_time = day.getHours() + "" + day.getMinutes() + "" + day.getSeconds();
			var current_date = today_date + '_' + today_time;
			// get all the req data
			let sender_number = req.body.mobile_number;

			logger.info(" [create csv query parameters] : " + sender_number)

			const insert_api_log = `INSERT INTO api_log VALUES(NULL,'${req.originalUrl}','${ip_address}','${req.body.request_id}','N','-','0000-00-00 00:00:00','Y',CURRENT_TIMESTAMP)`
			logger_all.info("[insert query request] : " + insert_api_log);
			const insert_api_log_result = await db.query(insert_api_log);
			logger_all.info("[insert query response] : " + JSON.stringify(insert_api_log_result))

			const check_req_id = `SELECT * FROM api_log WHERE request_id = '${req.body.request_id}' AND response_status != 'N' AND log_status='Y'`
			logger_all.info("[select query request] : " + check_req_id);
			const check_req_id_result = await db.query(check_req_id);
			logger_all.info("[select query response] : " + JSON.stringify(check_req_id_result));

			if (check_req_id_result.length != 0) {

				logger_all.info("[failed response] : Request already processed");
				logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

			}

			// to get the data in the array 
			var data = [
				['Name', 'Given Name', 'Group Membership', 'Phone 1 - Type', 'Phone 1 - Value']
			];
			// looping condition is true .to continue the process
			for (var i = 0; i < sender_number.length; i++) {
				data.push([`yjtec${day.getDate()}_${sender_number[i]}`, `yjtec${day.getDate()}_${sender_number[i]}`, '* myContacts', '', `${sender_number[i]}`])
			}

			// (C) CREATE CSV FILE to send the response in success message
			csv.stringify(data, async (err, output) => {
				fs.writeFileSync(`${media_storage}/uploads/whatsapp_docs/contacts_${current_date}.csv`, output);
				logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 1, response_status: 200, response_msg: 'Success ', file_location: `uploads/whatsapp_docs/contacts_${current_date}.csv`, request_id: req.body.request_id }))

				var log_update = `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
				logger.silly("[update query request] : " + log_update);
				const log_update_result = await db.query(log_update);
				logger.silly("[update query response] : " + JSON.stringify(log_update_result))

				res.json({ response_code: 1, response_status: 200, response_msg: 'Success ', file_location: `uploads/whatsapp_docs/contacts_${current_date}.csv`, request_id: req.body.request_id });
			});

		}
		catch (e) {// any error occurres send error response to client
			logger_all.info("[create csv failed response] : " + e)
			logger.info("[API RESPONSE] " + JSON.stringify({ response_code: 0, response_status: 201, response_msg: 'Error Occurred', request_id: req.body.request_id }))

			var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Error occurred' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
			logger.silly("[update query request] : " + log_update);
			const log_update_result = await db.query(log_update);
			logger.silly("[update query response] : " + JSON.stringify(log_update_result))

			res.json({ response_code: 0, response_status: 201, response_msg: 'Error Occurred', request_id: req.body.request_id });
		}
	});
// to listen the port in using the localhost
app.listen(port, () => {
	logger_all.info(`App started listening at http://localhost:${port}`);
});

// module.exports.logger = logger;

//  to listen the port in using the server

// httpServer.listen(port, function (req, res) {
// 	logger_all.info("Server started at port " + port);
// });

