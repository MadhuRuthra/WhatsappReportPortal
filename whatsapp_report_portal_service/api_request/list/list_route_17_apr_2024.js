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
const express = require("express");
const router = express.Router();
require("dotenv").config();
// Import the list functions page
const manage_sender_id_list = require("./manage_senderid_list");
const country_list = require("./country_list");
const servicecategorylist = require("./servicecategorylist");
const approve_whatspp_no_api_list = require("./approve_whatspp_no_api_list");
const login_time_list = require("./login_time_list");
const availablecreditslist = require("./availablecreditslist");
const senderidallowedlist = require("./senderidallowedlist");
const templatelist = require("./templatelist");
const ptemplatelist = require("./plemplatelist");
const templatewhatsapplist = require("./templatewhatsapplist");
const messagecreditlist = require("./messagecreditlist");
const manageuserslist = require("./manageuserslist");
const findblockedsenderidlist = require("./findblockedsenderidlist");
const approvewhatsappno = require("./approvewhatsappno");
const savephbabt = require("./savephbabt");
const faqlist = require("./faqlist");
const usersusertype = require("./usersusertype");
const mcparentuser = require("./mcparentuser");
const mcreceiveruser = require("./mcreceiveruser");
const usernamegenerate = require("./usernamegenerate");
const displaysuperadmin = require("./displaysuperadmin");
const displaydeptadmin = require("./displaydeptadmin");
const changepassword = require("./changepassword");
const managewhatsappnolist = require("./managewhatsappnolist");
const approvewhatsappnolist = require("./approvewhatsappnolist");
const whatsapplist = require("./whatsapplist");
const whatsappsenderid = require("./whatsappsenderid");
const masterlanguage = require("./masterlanguage");
const addmessagecredit = require("./addmessagecredit");
const messengerviewresponse = require("./messengerviewresponse");
const messengerresponseupdate = require("./messengerresponseupdate");
const readstatusupdate = require("./readstatusupdate");
const pricing_slot = require("./pricing_slot");
const Paymenthistory = require("./payment_history");
const ApprovePayment= require("./approve_payment");
const checkmsgcredit = require("./checkmsgcredit");
const user_sms_credit_raise = require("./user_sms_credit_raise");
const rppayment_user_id = require("./rpp_payment_user_id");
const rppayment_usrsmscrd_id = require("./rppayment_usrsmscrd_id");
const update_credit_raise_status = require("./update_credit_raise_status");
const view_onboarding = require("./view_onboarding");
const approve_reject_onboarding = require("./approve_reject_onboarding");
const check_sender_id = require("./check_sender_id");
const db = require("../../db_connect/connect");
const ActivationPayment = require("./activation_payment");
const ActivationPaymentUserId = require("./activation_pay_getuser_id");
const update_activation_payment = require("./activation_update_status");
const activation_details = require("./get_activation_detailes");
const activation_details_list = require("./activation_payment_list");
const Request_demo_list = require("./request_demo_list");
const ApproveTemplateList = require("./approve_template_list");
const Waiting_Approval_List = require("./waiting_approval_list")
const ApproveMessageList = require("./approve_compose_message");
const Manual_Upload_List = require("./manual_upload_list")
const DownloadComposeMessage = require("./download_compose_message");
const Manual_Report_pj = require("./manual_report_pj")
const GenerateReport = require("./generate_report");
const GenerateReportList = require("./generate_report_list");
const RejectCampaign = require("./reject_campaign");

// Import the validation page
const  update_credit_raise_statusvalidation= require("../../validation/update_credit_raise_statusvalidation");
const  rppayment_user_idvalidation= require("../../validation/rppayment_user_idvalidation");
const  rppayment_usrsmscrd_idvalidation= require("../../validation/rppayment_usrsmscrd_idvalidation");
const  user_sms_credit_raisevalidation= require("../../validation/user_sms_credit_raisevalidation");
const  checkavailablemsgvalidation= require("../../validation/checkavailablemsgvalidation");
const  approve_payment_validation= require("../../validation/approve_payment_validation");
const  paymenthistoryvalidation= require("../../validation/paymenthistoryvalidation");
const pricingslotValidation = require("../../validation/pricingslotValidation");
const approve_reject_onboarding_validation = require("../../validation/approve_reject_onboarding");
const ManageSenderIdValidation = require("../../validation/manage_sender_idlist_validation");
const CountryListValidation = require("../../validation/country_list");
const ServiceCategoryListValidation = require("../../validation/service_category");
const ApproveWhatsappNoApiListValidation = require("../../validation/approve_whatsapp_no_api");
const LoginTimeListValidation = require("../../validation/login_time");
const AvailableCreditsListValidation = require("../../validation/available_credits");
const SenderidAllowedListValidation = require("../../validation/senderid_allowed");
const TemplateListValidation = require("../../validation/template_list");
const TemplateWhatsappListValidation = require("../../validation/template_whatsapp_list");
const MessageCreditListValidation = require("../../validation/message_credit_list");
const ManageUsersListValidation = require("../../validation/manage_users");
const DeleteUsersValidation = require("../../validation/delete_users");
const ActivateUsersValidation = require("../../validation/activate_users");
const FindBlockedSenderidListValidation = require("../../validation/find_blocked_senderid");
const ApproveWhatsappNoValidation = require("../../validation/approve_whatsappno");
const SavePHBABTValidation = require("../../validation/save_phbabt");
const FAQListValidation = require("../../validation/faq");
const MCParentUserValidation = require("../../validation/mc_parent_user");
const MCReceiverUserValidation = require("../../validation/mc_receiver_user");
const UsersUserTypeValidation = require("../../validation/user_type");
const UsernameGenerateValidation = require("../../validation/username_generate");
const DisplaySuperAdminValidation = require("../../validation/display_super_admin");
const DisplayDeptAdminValidation = require("../../validation/display_dept_admin");
const ChangePasswordValidation = require("../../validation/change_password");
const ManageWhatsappNoListValidation = require("../../validation/manage_whatsappno_list");
const ApproveWhatsappNOListValidation = require("../../validation/approve_whatsapp_no");
const WhatsappListValidation = require("../../validation/whatsapp_list");
const WhatsappSenderIDValidation = require("../../validation/whatsapp_senderid");
const MasterLanguageValidation = require("../../validation/master_language");
const AddMessageCreditValidation = require("../../validation/add_message_credit");
const MessengerViewResponseValidation = require("../../validation/messenger_view_response");
const MessengerResponseUpdateValidation = require("../../validation/messenger_response_update");
const Read_status_validation = require("../../validation/read_status_validation");
const Activationpayment_validation = require("../../validation/activationpayment_validation");
const activation_details_validation = require("../../validation/activation_details_validation");
// const ApproveWhatsappValidation = require("../../validation/Approvewhatsappvalidation");
const approve_message_validation = require("../../validation/approve_message_validation");
const ComposeMessageValidation = require("../../validation/compose_message_validation")
const ManualReportPJValidation = require("../../validation/manual_report_pj_validation")
//const update_activation_payment_validation =  require("../../validation/activation_details_validation");
const update_activation_payment_validation =  require("../../validation/update_activation_payment");
// const edit_onboarding = require("./edit_onboarding");
const ViewOnboardingValidation = require("../../validation/view_onboarding");
//const approve_reject_onboarding_validation = require("../../validation/approve_reject_onboarding");
const GenerateReportValidation = require("../../validation/generate_report_validation");

// Import the default validation middleware
const validator = require('../../validation/middleware')
const valid_user = require("../../validation/valid_user_middleware");
const main = require('../../logger');
// sender_id_list - start
const update_profile_details = require("./update_profile_details");
const  update_profile_details_validation= require("../../validation/update_profile_details_validation");

router.post(
  "/approve_reject_onboarding",
  validator.body(approve_reject_onboarding_validation),
  valid_user,
  async function (req, res, next) {
    try { // access the approve_reject_onboarding function
      var logger = main.logger

      var logger_all = main.logger_all;
      var header_json = req.headers;
      let ip_address = header_json['x-forwarded-for'];

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
        logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed' }))

	var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
        logger.silly("[update query request] : " + log_update);
        const log_update_result = await db.query(log_update);
        logger.silly("[update query response] : " + JSON.stringify(log_update_result))

        return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

      }

      var result = await approve_reject_onboarding.ApproveRejectOnboarding(req);
      result['request_id'] = req.body.request_id;

      if (result.response_code == 0) {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
      else {
	logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }

      logger.info("[API RESPONSE] " + JSON.stringify(result))
      res.json(result);

    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);


router.post(
  "/edit_onboarding",
  //validator.body(update_profile_details_validation),
  valid_user,
  async function (req, res, next) {
    try { // access the update_profile_details function
      var logger = main.logger

      var logger_all = main.logger_all;
      var header_json = req.headers;
      let ip_address = header_json['x-forwarded-for'];
    
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
        logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed' }))
    
        var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
        logger.silly("[update query request] : " + log_update);
        const log_update_result = await db.query(log_update);
        logger.silly("[update query response] : " + JSON.stringify(log_update_result))
    
        return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });
    
      }
        
      var result = await update_profile_details.UpdateProfileDetails(req);
      result['request_id'] = req.body.request_id;

      if (result.response_code == 0) {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
      else {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }

      logger.info("[API RESPONSE] " + JSON.stringify(result))
      res.json(result);

    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);

router.post(
  "/sender_id_list",
  validator.body(ManageSenderIdValidation),
  valid_user,
  async function (req, res, next) {
    try { // access the getNumbers function
      var logger = main.logger

      var result = await manage_sender_id_list.ManageSenderIdList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// sender_id_list - end
// country_list -start
router.post(
  "/country_list",
  validator.body(CountryListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the CountryList function
      var logger = main.logger
      var result = await country_list.CountryList(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// country_list -end
// service_category_list - start
router.post(
  "/service_category_list",
  async function (req, res, next) {
    try {// access the ServiceCategoryList function
      var logger = main.logger

      var result = await servicecategorylist.ServiceCategoryList(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// service_category_list - end
// approve_whatsapp_no_api - start
router.post(
  "/approve_whatsapp_no_api",
  validator.body(ApproveWhatsappNoApiListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNoApiList function
      var logger = main.logger

      var result = await approve_whatspp_no_api_list.ApproveWhatsappNoApiList(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_whatsapp_no_api - end


// approve_template - start
router.post(
  "/approve_template_list",
  validator.body(CountryListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNoApiList function
      var logger = main.logger

      var result = await ApproveTemplateList.approveTemplateList(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_template - end

// login_time - start
router.post(
  "/login_time",
  async function (req, res, next) {
    try {// access the LoginTimeList function
      var logger = main.logger

      var result = await login_time_list.LoginTimeList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// login_time - end
// available_credits - start
router.get(
  "/available_credits",
  validator.body(AvailableCreditsListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the AvailableCreditsList function
      var logger = main.logger

      var result = await availablecreditslist.AvailableCreditsList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// available_credits - end
// senderid_allowed -start
router.get(
  "/senderid_allowed",
  validator.body(SenderidAllowedListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the SenderidAllowedList function
      var logger = main.logger

      var result = await senderidallowedlist.SenderidAllowedList(req);       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// senderid_allowed -end
// template_list - start
router.post(
  "/template_list",
  validator.body(TemplateListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the TemplateList function
      var logger = main.logger

      var result = await templatelist.TemplateList(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// template_list - end
// p_template_list - start
router.get(
  "/p_template_list",
  validator.body(TemplateListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the PTemplateList function
      var logger = main.logger

      var result = await ptemplatelist.PTemplateList(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// p_template_list - end
// get_sent_messages_status_list - start
router.post(
  "/get_sent_messages_status_list",
  validator.body(TemplateWhatsappListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the TemplateWhatsappList function
      var logger = main.logger

      var result = await templatewhatsapplist.TemplateWhatsappList(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// get_sent_messages_status_list - end

// message_credit_list - start
router.post(
  "/message_credit_list",
  validator.body(MessageCreditListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the MessageCreditList function
      var logger = main.logger

      var result = await messagecreditlist.MessageCreditList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// message_credit_list - end

// manage_users - start
router.get(
  "/manage_users",
  validator.body(ManageUsersListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ManageUsersList function
      var logger = main.logger

      var result = await manageuserslist.ManageUsersList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// manage_users - end

// delete_users - start
router.post(
  "/delete_users",
  validator.body(DeleteUsersValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ManageUsersList function
      var logger = main.logger

      var result = await manageuserslist.DeleteUsers(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// delete_users - end



// activate_users - start
router.post(
  "/activate_users",
  validator.body(ActivateUsersValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ManageUsersList function
      var logger = main.logger

      var result = await manageuserslist.ActivateUsers(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activate_users - end


// find_blocked_senderid - start
router.get(
  "/find_blocked_senderid",
  validator.body(FindBlockedSenderidListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the FindBlockedSenderidList function
      var logger = main.logger

      var result = await findblockedsenderidlist.FindBlockedSenderidList(req);       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// find_blocked_senderid - end
// approve_whatsappno - start
router.post(
  "/approve_whatsappno",
  validator.body(ApproveWhatsappNoValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNo function
      var logger = main.logger

      var result = await approvewhatsappno.ApproveWhatsappNo(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_whatsappno - end
// save_phbabt -start
router.post(
  "/save_phbabt",
  validator.body(SavePHBABTValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the SavePHBABT function
      var logger = main.logger

      var result = await savephbabt.SavePHBABT(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// save_phbabt -end
// faq - start
router.get(
  "/faq",
  validator.body(FAQListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the FAQList function
      var logger = main.logger

      var result = await faqlist.FAQList(req);       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// faq - end
// mc_parent_user - start
router.get(
  "/mc_parent_user",
  validator.body(MCParentUserValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the MCParentUser function
      var logger = main.logger

      var result = await mcparentuser.MCParentUser(req);       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// mc_parent_user - end
// mc_receiver_user - start
router.get(
  "/mc_receiver_user",
  validator.body(MCReceiverUserValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the MCReceiverUser function
      var logger = main.logger

      var result = await mcreceiveruser.MCReceiverUser(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// mc_receiver_user - end
// user_type - start
router.get(
  "/user_type",
  validator.body(UsersUserTypeValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the UsersUserType function
      var logger = main.logger

      var result = await usersusertype.UsersUserType(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// user_type - end
// username_generate- start
router.get(
  "/username_generate",
  validator.body(UsernameGenerateValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the UsernameGenerate function
      var logger = main.logger

      var result = await usernamegenerate.UsernameGenerate(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// username_generate- end
// display_super_admin - start
router.get(
  "/display_super_admin",
  async function (req, res, next) {
    try {// access the DisplaySuperAdmin function
      var logger = main.logger

      var result = await displaysuperadmin.DisplaySuperAdmin(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// display_super_admin - end
// display_dept_admin - start
router.get(
  "/display_dept_admin",
  validator.body(DisplayDeptAdminValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the DisplayDeptAdmin function
      var logger = main.logger

      var result = await displaydeptadmin.DisplayDeptAdmin(req);       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// display_dept_admin - end
// change_password - start
router.post(
  "/change_password",
  validator.body(ChangePasswordValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ChangePassword function
      var logger = main.logger

      var logger_all = main.logger_all;

      var header_json = req.headers;
      let ip_address = header_json['x-forwarded-for'];
    
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
        logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed' }))
    
        var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
        logger.silly("[update query request] : " + log_update);
        const log_update_result = await db.query(log_update);
        logger.silly("[update query response] : " + JSON.stringify(log_update_result))
    
        return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });
    
      }

      var result = await changepassword.ChangePassword(req);

      result['request_id'] = req.body.request_id;

      if (result.response_code == 0) {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
      else {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// change_password - end
// manage_whatsappno_list -start
router.post(
  "/manage_whatsappno_list",
  validator.body(ManageWhatsappNoListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ManageWhatsappNoList function
      var logger = main.logger

      var result = await managewhatsappnolist.ManageWhatsappNoList(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// manage_whatsappno_list -end
// approve_whatsapp_no - start
router.post(
  "/approve_whatsapp_no",
  validator.body(ApproveWhatsappNOListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNOList function
      var logger = main.logger

      var result = await approvewhatsappnolist.ApproveWhatsappNOList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_whatsapp_no - end
// approve_whatsapp_no - start
router.post(
  "/whatsapp_list",
  validator.body(WhatsappListValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the WhatsappList function
      var logger = main.logger

      var result = await whatsapplist.WhatsappList(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_whatsapp_no - end
// whatsapp_senderid -start
router.post(
  "/whatsapp_senderid",
  validator.body(WhatsappSenderIDValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the WhatsappSenderID function
      var logger = main.logger

      var result = await whatsappsenderid.WhatsappSenderID(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// whatsapp_senderid -end
// whatsapp_senderid -start
router.post(
  "/master_language",
  validator.body(MasterLanguageValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the MasterLanguage function
      var logger = main.logger

     var result = await masterlanguage.MasterLanguage(req);     

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// whatsapp_senderid -end
// add_message_credit - start
router.post(
  "/add_message_credit",
  validator.body(AddMessageCreditValidation),
  valid_user,
  async function (req, res, next) {
    try { // access the AddMessageCredit function
      var logger = main.logger
      var logger_all = main.logger_all;

      var header_json = req.headers;
      let ip_address = header_json['x-forwarded-for'];

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
        logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed' }))

        var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
        logger.silly("[update query request] : " + log_update);
        const log_update_result = await db.query(log_update);
        logger.silly("[update query response] : " + JSON.stringify(log_update_result))

        return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

      }

      var result = await addmessagecredit.AddMessageCredit(req); 

      result['request_id'] = req.body.request_id;

      if (result.response_code == 0) {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
      else {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// add_message_credit - end
// messenger_view_response - start
router.post(
  "/messenger_view_response",
  validator.body(MessengerViewResponseValidation),
  valid_user,
  async function (req, res, next) {
    try { // access the MessengerViewResponse function
      var logger = main.logger

      var result = await messengerviewresponse.MessengerViewResponse(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// messenger_view_response - end
// messenger_response_update - start
router.post(
  "/messenger_response_update",
  validator.body(MessengerResponseUpdateValidation),
  valid_user,
  async function (req, res, next) {
    try { // access the MessengerResponseUpdate function
      var logger = main.logger

      var result = await messengerresponseupdate.MessengerResponseUpdate(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// messenger_response_update - end
// read_status_update -start
router.post(
  "/read_status_update",
  validator.body(Read_status_validation),
  valid_user,
  async function (req, res, next) {
    try { // access the ReadStatusUpdate function
      var logger = main.logger

      var result = await readstatusupdate.ReadStatusUpdate(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// read_status_update - end

// pricingslot -start
router.post(
  "/pricing_slot",
  validator.body(pricingslotValidation),
  valid_user,
  async function (req, res, next) {
    try { // access the ReadStatusUpdate function
      var logger = main.logger

      var result = await pricing_slot.pricingslot(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// pricingslot - end


// Paymenthistory -start
router.post(
  "/payment_history",
  validator.body(paymenthistoryvalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the Paymenthistory function
      var logger = main.logger

      var result = await Paymenthistory.PaymentHistory(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// Paymenthistory - end

// ApprovePayment -start
router.post(
  "/approve_payment",
  validator.body(approve_payment_validation),
  valid_user,
  async function (req, res, next) {
    try { // access the Paymenthistory function
      var logger = main.logger

      var logger_all = main.logger_all;

      var header_json = req.headers;
      let ip_address = header_json['x-forwarded-for'];

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
        logger.info("[API RESPONSE] " + JSON.stringify({ request_id: req.body.request_id, response_code: 0, response_status: 201, response_msg: 'Request already processed' }))

        var log_update = `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = 'Request already processed' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`
        logger.silly("[update query request] : " + log_update);
        const log_update_result = await db.query(log_update);
        logger.silly("[update query response] : " + JSON.stringify(log_update_result))

        return res.json({ response_code: 0, response_status: 201, response_msg: 'Request already processed', request_id: req.body.request_id });

      }

      var result = await ApprovePayment.approvepayment(req);

	result['request_id'] = req.body.request_id;

      if (result.response_code == 0) {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'F',response_date = CURRENT_TIMESTAMP, response_comments = '${result.response_msg}' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
      else {
        logger.silly("[update query request] : " + `UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        const update_api_log = await db.query(`UPDATE api_log SET response_status = 'S',response_date = CURRENT_TIMESTAMP, response_comments = 'Success' WHERE request_id = '${req.body.request_id}' AND response_status = 'N'`);
        logger.silly("[update query response] : " + JSON.stringify(update_api_log))
      }
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// ApprovePayment - end

// check_available_msg -start
router.post(
  "/check_available_msg",
  validator.body(checkavailablemsgvalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the check_available_msg function
      var logger = main.logger

      var result = await checkmsgcredit.CheckAvailableMsg(req);
       
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// check_available_msg - end

// user_sms_credit_raise -start
router.post(
  "/user_sms_credit_raise",
  validator.body(user_sms_credit_raisevalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the user_sms_credit_raise function
      var logger = main.logger
      var result = await user_sms_credit_raise.User_Sms_Credit_Raise(req);
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// user_sms_credit_raise - end

// Rppayment_User_id -start
router.post(
  "/rppayment_user_id",
  validator.body(rppayment_user_idvalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the Rppayment_User_id function
      var logger = main.logger
      var result = await rppayment_user_id.Rppayment_User_id(req);
      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// Rppayment_User_id - end

// Rppayment_usrsmscrd_id -start
router.post(
  "/rppayment_usrsmscrd_id",
  validator.body(rppayment_usrsmscrd_idvalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the Rppayment_usrsmscrd_id function
      var logger = main.logger
      var result = await rppayment_usrsmscrd_id.Rppayment_usrsmscrd_id(req);
      logger.info("[API RESPONSE] " + JSON.stringify(result))
      res.json(result);

    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// Rppayment_usrsmscrd_id - end

// UpdateCreditRaisetatus - start
router.post(
  "/update_credit_raise_status",
  validator.body(update_credit_raise_statusvalidation),
  valid_user,
  async function (req, res, next) {
    try { // access the UpdateCreditRaisestatus function
      var logger = main.logger
      var result = await update_credit_raise_status.UpdateCreditRaisestatus(req);
      logger.info("[API RESPONSE] " + JSON.stringify(result))
      res.json(result);

    } catch (err) { // any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// UpdateCreditRaisetatus - end

/* // edit_onboarding - start
router.post(
  "/edit_onboarding",
  validator.body(EditOnboardingValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the EditOnboarding function
      var logger = main.logger

      var result = await edit_onboarding.EditOnboarding(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// edit_onboarding - end */

// view_onboarding - start
router.post(
  "/view_onboarding",
  async function (req, res, next) {
    try {// access the ViewOnboarding function
      var logger = main.logger

      var result = await view_onboarding.ViewOnboarding(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// view_onboarding - end

// check_sender_id - start
router.post(
  "/check_sender_id",
  async function (req, res, next) {
    try {// access the ViewOnboarding function
      var logger = main.logger

      var result = await check_sender_id.CheckSenderId(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// check_sender_id - end

// activation_payment - start
router.post(
  "/activation_payment",  
 validator.body(Activationpayment_validation),
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger
      var result = await ActivationPayment.AddActivation_payment(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activation_payment - end

// activation_payment - start
router.post(
  "/act_pay_user_id",  
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await ActivationPaymentUserId.AddActivation_paymentuserid(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activation_payment - end

// activation_payment - start
router.put(
  "/update_activation_payment",  
  validator.body(update_activation_payment_validation),
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await update_activation_payment.Activationupdatestatus(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activation_payment - end

// activation_payment - start
router.get(
  "/activation_details",  
  validator.body(activation_details_validation),
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await activation_details.Activation_details(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activation_payment - end

// activation_payment_list - start
router.get(
  "/activation_payment_list",  
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await activation_details_list.AddActivation_list(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// activation_payment_list - end

// request_demo_list - start
router.get(
  "/request_demo_list",  
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await Request_demo_list.RequestDemolist(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// request_demo_list - end

// waiting_approval_list - start
router.get(
  "/waiting_approval_list",  
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await Waiting_Approval_List.WaitingApprovalList(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// waiting_approval_list - end

// approve_compose_message - start
router.post(
  "/approve_compose_message",
  validator.body(approve_message_validation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNoApiList function
      var logger = main.logger

      var result = await ApproveMessageList.approveComposeMessage(req);
       

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// approve_compose_message - end

// download_compose_message - start
router.post(
  "/download_compose_message",
  validator.body(ComposeMessageValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the ApproveWhatsappNoApiList function
      var logger = main.logger

      var result = await DownloadComposeMessage.downloadComposeMessage(req, res);
      //await downloadComposeMessage(req, res); 

      logger.info("[Downlaod File API RESPONSE] " + JSON.stringify(result))

      res.json(result);
      
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while [download file]`, err.message);
      next(err);
      //res.status(500).json({ response_code: 0, response_status: 500, response_msg: 'Internal server error' });
    }
  }
);
// download_compose_message - end


// manual_upload_list - start
router.get(
  "/manual_upload_list",  
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await Manual_Upload_List.ManualUploadList(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// manual_upload_list - end


// manual_report_pj - start
router.post(
  "/manual_report_pj",  
  validator.body(ManualReportPJValidation),
  valid_user,
  async function (req, res, next) {
   // console.log("!!!1");
    try {// access the activation_payment function
      var logger = main.logger

      var result = await Manual_Report_pj.ManualReportPJ(req);

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// manual_report_pj - end


// generate_report - start
router.post(
  "/generate_report",
  validator.body(GenerateReportValidation),
  valid_user,
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await GenerateReport.generatereport(req);

        logger.info("[API RESPONSE] " + result)

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// generate_report - end


// generate_report_list - start
router.get(
  "/generate_report_list",
  async function (req, res, next) {
    try {// access the activation_payment function
      var logger = main.logger

      var result = await GenerateReportList.generatereportlist(req);

        logger.info("[API RESPONSE] " + result)

      logger.info("[API RESPONSE] " + JSON.stringify(result))

      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// generate_report_list - end

// reject_campaign - start
 router.put(
  "/reject_campaign",
  async function (req, res, next) {
    try {// access the reject_campaign function
      var logger = main.logger
      var result = await RejectCampaign.Reject_Campaign(req);
        logger.info("[API RESPONSE] " + result)
      logger.info("[API RESPONSE] " + JSON.stringify(result))
      res.json(result);
    } catch (err) {// any error occurres send error response to client
      console.error(`Error while getting data`, err.message);
      next(err);
    }
  }
);
// reject_campaign - end

module.exports = router;

