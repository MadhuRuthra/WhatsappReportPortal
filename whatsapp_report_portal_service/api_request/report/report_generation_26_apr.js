const db = require("../../db_connect/dynamic_connect");
require("dotenv").config();
const main = require('../../logger')

async function report_update(req) {
    var logger_all = main.logger_all
    var logger = main.logger

    try {
        var database = req.body.database;
        var table_name = req.body.table_name;
        var compose_whatsapp_id = req.body.compose_whatsapp_id;
        var report_group = req.body.report_group;
        var user_id = req.body.compose_user;

        logger_all.info("CG report generation")
        var status = ["BLOCKED", "DELIVERED", "INCAPABLE", "INVALID", "READ", "SENT", "NOT AVAILABLE", "FAILED"]
        var status_failure = ["BLOCKED", "INCAPABLE", "INVALID", "NOT AVAILABLE", "FAILED"]
        var status_success = ["DELIVERED", "SENT", "READ"]

        var select_count = `SELECT COUNT(*) as count FROM ${database}.${table_name} WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}'`
        logger_all.info("[Select query request] : " + select_count);
        var select_count_result = await db.query(select_count);
        logger_all.info("[Select query response] : " + JSON.stringify(select_count_result))
        // var limit_count = 500;
        var total_count_data = select_count_result[0].count;

        var select_date = `SELECT whatsapp_entry_date,campaign_name,campaign_id FROM ${database}.compose_whatsapp_tmpl_${user_id} WHERE compose_whatsapp_id = '${compose_whatsapp_id}'`
        logger_all.info("[Select query request] : " + select_date);
        var select_date_result = await db.query(select_date);
        logger_all.info("[Select query response] : " + JSON.stringify(select_date_result))
        // var limit_count = 500;
        var com_date = select_date_result[0].whatsapp_entry_date;
        var campaign_name = select_date_result[0].campaign_name;
        var campaign_id = select_date_result[0].campaign_id;


        const randomMinutes = Math.floor(Math.random() * 6) + 30;
        const randomSeconds = Math.floor(Math.random() * 59) + 1;

        // Get current time in IST
        const ISTTime = new Date(com_date);
        ISTTime.setMinutes(ISTTime.getMinutes() + randomMinutes);
        ISTTime.setSeconds(randomSeconds);

        const currentTime = new Date(ISTTime.getTime() + (5.5 * 60 * 60 * 1000));

        /*logger_all.info(total_count_data.toString().length)
            for (var i = 0; i < total_count_data; i) {
    
                console.log("Current time in IST:", currentTime);
    
                // Generate a random time between current time and one hour ahead time in IST
                const randomTime = new Date(currentTime.getTime() + Math.floor(Math.random() * 3600000));
    
                // Format the random time as "yyyy-mm-dd hh:ii:ss"
                const formattedRandomTime = randomTime.toISOString().slice(0, 19).replace('T', ' ');
                // Get random value from array
                //const randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
          var randomcount;
    
                if(total_count_data.toString().length <= 4){
                    randomcount = total_count_data.toString().length;
                }
                else{
                    randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
                }
    
                var query = `update ${database}.${table_name} SET delivery_date = '${formattedRandomTime}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_date is NULL ORDER BY RAND()
                LIMIT ${randomcount}`
                logger_all.info("[Select query request] : " + query);
                var report_update = await db.query(query);
                logger_all.info("[Select query response] : " + JSON.stringify(report_update))
    
                i = i + randomcount
            }*/

        /*        const tenPercentValue = Math.ceil((10 / 100) * total_count_data);
        
                // Calculate 85% value
                const eightyFivePercentValue = Math.ceil((85 / 100) * total_count_data);
                const FivePercentValue = Math.ceil((5 / 100) * total_count_data);
        
                for (var k = 0; k < tenPercentValue; k) {
        
                    const randomIndex = Math.floor(Math.random() * status_failure.length);
        
                    // Get random value from array
                    const randomValue = status_failure[randomIndex];
                    const randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
        
                    console.log("Random value:", randomValue);
                    var query = `update ${database}.${table_name} SET delivery_status = '${randomValue}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_status is NULL ORDER BY RAND()
                    LIMIT ${randomcount}`
                    logger_all.info("[Select query request] : " + query);
                    var report_update = await db.query(query);
                    logger_all.info("[Select query response] : " + JSON.stringify(report_update))
                    k = k + randomcount;
                }
        
                for (var k = 0; k < eightyFivePercentValue; k) {
        
                    const randomIndex = Math.floor(Math.random() * status_success.length);
        
                    // Get random value from array
                    const randomValue = status_success[randomIndex];
                    const randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
        
                    console.log("Random value:", randomValue);
                    var query = `update ${database}.${table_name} SET delivery_status = '${randomValue}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_status is NULL ORDER BY RAND()
                    LIMIT ${randomcount}`
                    logger_all.info("[Select query request] : " + query);
                    var report_update = await db.query(query);
                    logger_all.info("[Select query response] : " + JSON.stringify(report_update))
                    k = k + randomcount;
                }
        
                for (var k = 0; k < FivePercentValue; k) {
        
                    const randomIndex = Math.floor(Math.random() * status.length);
        
                    // Get random value from array
                    const randomValue = status[randomIndex];
                    const randomcount = Math.floor(Math.random() * (501 - 100)) + 100;
        
                    console.log("Random value:", randomValue);
                    var query = `update ${database}.${table_name} SET delivery_status = '${randomValue}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_status is NULL ORDER BY RAND()
                    LIMIT ${randomcount}`
                    logger_all.info("[Select query request] : " + query);
                    var report_update = await db.query(query);
                    logger_all.info("[Select query response] : " + JSON.stringify(report_update))
                    k = k + randomcount;
                }
        
        
            for (var k = 0; k < total_count_data; k) {
        
                    const randomIndex = Math.floor(Math.random() * status_success.length);
        
                    // Get random value from array
                    const randomValue = status_success[randomIndex];
                    //const randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
                var randomcount;
        
                    if(total_count_data.toString().length <= 4){
                        randomcount = total_count_data.toString().length;
                    }
                    else{
                        randomcount = Math.floor(Math.random() * (701 - 500)) + 500;
                    }
        
                    //console.log("Random value:", randomValue);
                  var query = `update ${database}.${table_name} SET delivery_status = '${randomValue}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_status is NULL ORDER BY RAND()
                    LIMIT ${randomcount}`
        
                    logger_all.info("[Select query request] : " + query);
                    var report_update = await db.query(query);
                    logger_all.info("[Select query response] : " + JSON.stringify(report_update))
                    k = k + randomcount;
                }*/

        var randomcount = [];
        const FourtyPercentValue = Math.ceil((40 / 100) * total_count_data);
        const ThirtyThreePercentValue = Math.ceil((33 / 100) * total_count_data);
        const RemainingValue = total_count_data - (FourtyPercentValue + ThirtyThreePercentValue)

        randomcount.push(FourtyPercentValue);
        randomcount.push(ThirtyThreePercentValue);
        randomcount.push(RemainingValue);

        var select_summary = `select * from whatsapp_report.user_summary_report WHERE com_msg_id = '${compose_whatsapp_id}' and campaign_name = '${campaign_name}' and campaign_id = '${campaign_id}'`;
        logger_all.info("[select_summary_report] : " + select_summary);
        select_summary_results = await db.query(select_summary);

        logger_all.info("[select_summary_report response] : " + JSON.stringify(select_summary_results))
        if (select_summary_results[0].generate_status == 'N') {
            for (var k = 0; k < status_success.length; k) {
                logger_all.info(randomcount)
                // Generate a random time between current time and one hour ahead time in IST
                const randomTime = new Date(currentTime.getTime() + Math.floor(Math.random() * 3600000));

                // Format the random time as "yyyy-mm-dd hh:ii:ss"
                const formattedRandomTime = randomTime.toISOString().slice(0, 19).replace('T', ' ');

                var query = `update ${database}.${table_name} SET delivery_status = '${status_success[k]}',delivery_date = '${formattedRandomTime}' WHERE compose_whatsapp_id = '${compose_whatsapp_id}' AND report_group = '${report_group}' AND delivery_status is NULL ORDER BY RAND() LIMIT ${randomcount[k]}`;

                logger_all.info("[Select query request] : " + query);
                var report_update = await db.query(query);
                logger_all.info("[Select query response] : " + JSON.stringify(report_update))
                k = k + 1;
            }

            var select_status_count = `SELECT COUNT(DISTINCT CASE WHEN delivery_status = 'SENT' THEN comwtap_status_id END) AS total_success,COUNT(DISTINCT CASE WHEN delivery_status = 'DELIVERED' THEN comwtap_status_id END) AS total_delivered, COUNT(DISTINCT CASE WHEN delivery_status = 'READ' THEN comwtap_status_id END) AS total_read,COUNT(DISTINCT CASE WHEN delivery_status IN ('BLOCKED', 'INCAPABLE', 'NOT AVAILABLE', 'FAILED','INVALID','UNAVAILABLE') THEN comwtap_status_id END) AS total_failed, COUNT(DISTINCT CASE WHEN delivery_status = 'INVALID' THEN comwtap_status_id END) AS total_invalid FROM whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} where compose_whatsapp_id = '${compose_whatsapp_id}' and report_group = '${report_group}'`;
            logger_all.info("[select_summary_report] : " + select_status_count);
            var status_count_result = await db.query(select_status_count);
            logger_all.info("[select_summary_report response] : " + JSON.stringify(status_count_result))

            var failed_count = status_count_result[0].total_failed + status_count_result[0].total_invalid;
            var success_count = status_count_result[0].total_success;
            var read_count = status_count_result[0].total_read;
            var delivery_count = status_count_result[0].total_delivered;

            var totalcg_count = failed_count + success_count + read_count + delivery_count;

            var update_summary = `UPDATE whatsapp_report.user_summary_report SET total_waiting = 0,total_process = 0,total_failed = ${failed_count},total_read = ${read_count},total_delivered = ${delivery_count},total_success = ${success_count},sum_end_date = CURRENT_TIMESTAMP,generate_status = 'Y' WHERE com_msg_id = '${compose_whatsapp_id}' and user_id = '${user_id}'`;

            logger_all.info("[update_summary_report] : " + update_summary);
            update_summary_results = await db.query(update_summary);
            logger_all.info("[update_summary_report response] : " + JSON.stringify(update_summary_results))


            var select_compose = await db.query(`select * from whatsapp_report.master_compose_whatsapp WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_whatsapp_id, user_id]);
            logger_all.info("[master_compose_whatsapp] : " + JSON.stringify(select_compose));
            var update_compose;

            if (select_compose[0].total_updated_count == select_compose[0].tgbase_count) {
                logger_all.info("Coming If");
                console.log(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_cgbase = '${totalcg_count}' WHERE compose_whatsapp_id = ? and user_id = ?`[compose_whatsapp_id, user_id]);
                var update_compose = await db.query(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_cgbase = '${totalcg_count}',total_updated_count = '${select_compose[0].total_mobileno_count}' WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_whatsapp_id, user_id]);
            } else {
                logger_all.info("Coming Else");
                console.log(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_cgbase = '${totalcg_count}' WHERE compose_whatsapp_id = ? and user_id = ?`[compose_whatsapp_id, user_id]);
                var update_compose = await db.query(`UPDATE whatsapp_report.master_compose_whatsapp SET updated_cgbase = '${totalcg_count}' WHERE compose_whatsapp_id = ? and user_id = ?`, [compose_whatsapp_id, user_id]);
            }

            logger_all.info(JSON.stringify(update_compose));
        }
        return { response_code: 1, response_status: 200, response_msg: 'Success' };
    }

    catch (err) {
        // Failed - call_index_signin Sign in function
        logger_all.info("[country list report] Failed - " + err);
        return { response_code: 0, response_status: 201, response_msg: 'Error Occurred.' };
    }
}

module.exports = {
    report_update
};

