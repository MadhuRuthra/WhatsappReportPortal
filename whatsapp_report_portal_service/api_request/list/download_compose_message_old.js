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

// download_compose_message - start
async function downloadComposeMessage(req, res) 
{
	var logger_all = main.logger_all
	var logger = main.logger

	const admin_user_id = req.body.user_id;
	const user_id = req.body.compose_user_id;
	const compose_id = req.body.compose_id;
    	const pjValue = req.body.PJvalue;
    	const yjValue = req.body.YJvalue;
	try 
	{
		// Fetch mobile numbers based on compose_id
		const mobileNumbers = await fetchMobileNumbers(user_id, compose_id);
		// Split mobile numbers based on PJ and YJ values
		const { pjRows, yjRows } = splitMobileNumbers(mobileNumbers, pjValue);
		// Generate CSV files
		const pjFilePath = await generateCSV(pjRows, pjValue, 'TGBase', user_id, compose_id);
        	const yjFilePath = await generateCSV(yjRows, yjValue, 'CGBase', user_id, compose_id);

function getFileNameFromURL(url) {
    // Split the URL by slashes
    const parts = url.split('/');
    // Get the last part (which represents the file name)
    const fileName = parts[parts.length - 1];
    return fileName;
}

const pjFilename = getFileNameFromURL(pjFilePath);
console.log(pjFilename); 

const yjFilename = getFileNameFromURL(yjFilePath);
console.log(yjFilename);



					var update_base = `UPDATE whatsapp_report_${user_id}.compose_whatsapp_tmpl_${user_id} SET tg_base = '${pjFilename}',cg_base = '${yjFilename}' WHERE compose_whatsapp_id = '${compose_id}'`;
					logger.silly("[update query request] : " + update_base);
					const update_base_res = await db.query(update_base);
					logger.silly("[update query response] : " + JSON.stringify(update_base_res));


		// Update report_group in the database
        //	await updateReportGroup(pjRows, 'TGBase', user_id, compose_id);
        //	await updateReportGroup(yjRows, 'CGBase', user_id, compose_id);

		//res.status(200).json({ message: 'CSV files generated successfully' });
		return { response_code: 1, response_status: 200, response_msg: 'CSV files generated successfully', pj_file_path: pjFilePath,
		yj_file_path: yjFilePath };

	}
	catch (e) 
	{// any error occurres send error response to client
		logger_all.info("[download_compose_message failed response] : " + e)
		//return { response_code: 0, response_status: 201, response_msg: 'Error occured' };
		return { response_code: 0, response_status: 500, response_msg: 'Internal server error' };
	}
}
// download_compose_message - end

// Function to fetch mobile numbers based on compose_id
async function fetchMobileNumbers(user_id, compose_id) 
{
	// Implement logic to fetch mobile numbers from your database
	try 
	{
		const query = "SELECT wt.mobile_nos, wt.total_mobileno_count, wt.media_url, wt.variable_values, wt.mobile_no_type, wt.whatsapp_entry_date, um.user_name, wt.campaign_id, wt.campaign_name, mt.templateid, mt.template_name, mt.media_type, mt.body_variable_count FROM whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " wt INNER JOIN whatsapp_report.user_management um ON wt.user_id = um.user_id INNER JOIN whatsapp_report.message_template mt ON wt.unique_template_id = mt.unique_template_id WHERE wt.compose_whatsapp_id = ?";

        	// Log the constructed query string for debugging
        	console.log(query);
        
        	// Execute the SQL query
        	const csv_datas = await db.query(query, [compose_id]);
		//console.log("Rows:", csv_datas);

		return csv_datas;
	} 
	catch (error) 
	{
		// Handle any errors that occur during database query
		console.error('Error fetching mobile numbers:', error);
		throw new Error('Failed to fetch mobile numbers');
	}
}

function splitMobileNumbers(csv_datas, pjPercentage) 
{
	 console.log(csv_datas);
     	 // Extract mobile_nos from the first row
	 const mobileNosBlob = csv_datas[0].mobile_nos;
	 const variableBlob = csv_datas[0].variable_values;

	 // Convert the Blob to a string
	 const mobileNosString = Buffer.from(mobileNosBlob).toString('utf-8'); 
	 const variableValueBlob = Buffer.from(variableBlob).toString('utf-8');
 
	 console.log(variableValueBlob);
	 // Split the string by comma to get individual mobile numbers
	var mobileNumbers = mobileNosString.split(',');
	 //const variableValuesArray = JSON.parse(variableValueBlob);
	 const VariableValues = JSON.parse(variableValueBlob);


	// Shuffle the mobile numbers array randomly
    	mobileNumbers = shuffleArray(mobileNumbers);

	 const totalNumbers = mobileNumbers.length;
	 const pjCount = Math.ceil(totalNumbers * (pjPercentage / 100));
	 console.log("pjcount:", pjCount);
 
	// Prepare pjRows and yjRows with all data
   	const pjRows = [];
    	const yjRows = [];

	const { total_mobileno_count, whatsapp_entry_date, user_name, campaign_id, campaign_name, templateid, template_name, media_type, media_url, body_variable_count} = csv_datas[0];

    	for (let i = 0; i < pjCount; i++) 
    	{
        	pjRows.push({
            		mobile_nos: mobileNumbers[i],
			variable_values: VariableValues[i],
		        total_mobileno_count,
           		 whatsapp_entry_date,
            		user_name,
            		campaign_id,
            		campaign_name,
            		templateid,
            		template_name,
	    		media_type,
	    		media_url,
	    		body_variable_count
        	});
    	}

    	for (let i = pjCount; i < totalNumbers; i++) 
    	{
        	yjRows.push({
            		mobile_nos: mobileNumbers[i],
	    		variable_values: VariableValues[i],
            		total_mobileno_count,
            		whatsapp_entry_date,
            		user_name,
            		campaign_id,
            		campaign_name,
            		templateid,
            		template_name,
	    		media_type,
	    		media_url,
	    		body_variable_count
        	});
    	}
 
    	console.log("pjrows:", pjRows);
	console.log("yjrows:", yjRows);
	return { pjRows, yjRows };
}



// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



// Function to generate CSV file
async function generateCSV(csv_datas, percentageType, fileType, user_id, compose_id) 
{
	console.log(csv_datas);
	console.log(csv_datas.length); // Log the length of csv_datas
    	console.log(csv_datas[0]); 
	// console.log(percentageType);
    
	const directoryPath = '/var/www/html/whatsapp_report_portal/uploads/report_csv_files';
	//const directoryPath = 'https://simplyreach.in/whatsapp_report_portal/uploads/report_csv_files';

	console.log(directoryPath);

	// Extracting campaign_name from the first object in csv_datas
    	const campaignName = csv_datas[0].campaign_name;
	console.log(campaignName);

	const mediatype = csv_datas[0].media_type;
	console.log(mediatype);

	const hasMediaType = csv_datas[0].media_type !== null;
	console.log(hasMediaType);

	const variableCount = csv_datas[0].body_variable_count;

    	const filePath = path.join(directoryPath, `${campaignName}_${fileType}_${percentageType}.csv`);
    
	const header = 
	[
        	{ id: 'mobile_number', title: 'contacts' },
    	];

	// Conditionally add media_type to the header if not null
    	if (hasMediaType) 
	{
        	header.push({ id: 'media_type', title: '1' });
    	}

	// Conditionally add headers for variable_count
	if (variableCount !== 0) 
	{
		for (let i = 1; i <= variableCount; i++) {
			header.push({ id: `var${i}`, title: `${i}` });
		}
	}

    	const csvWriter = createCsvWriter({
        	path: filePath,
        	header,
    	});


	var mob_no = "";
	const records = csv_datas.map(data => 
	{

		mob_no = mob_no + data.mobile_nos + ",";
        	const record = {
            		mobile_number: data.mobile_nos,
        };

        // Conditionally add media_type to the record if not null
        if (hasMediaType) 
	{
            record.media_type = data.media_url;
        }

	// Conditionally add variable_values to the record if variableCount is not 0
	if (variableCount !== 0) 
	{
		for (let i = 0; i < variableCount; i++) {
			record[`var${i + 1}`] = data.variable_values[i] || ''; // Assign variable value or an empty string if undefined
		}
	}

        return record;
    });
    
    csvWriter.writeRecords(records)
        .then(() => console.log(`${campaignName}_${percentageType}.csv file generated successfully`))
        .catch(err => console.error('Error writing CSV:', err));

	const query = `
            UPDATE whatsapp_report_${user_id}.compose_whatsapp_status_tmpl_${user_id} SET report_group = ? WHERE mobile_no IN (${mob_no.slice(0,-1)}) AND compose_whatsapp_id = ?`;  // Parameters for the query
        const queryParams = [fileType, compose_id];

	console.log(query);

	await db.query(query, queryParams);

	await db.query("UPDATE whatsapp_report_" + user_id + ".compose_whatsapp_tmpl_" + user_id + " SET whatsapp_status = 'P' WHERE compose_whatsapp_id = ? ", [compose_id]);
   
    return filePath;
}


// using for module exporting
module.exports = {
	downloadComposeMessage
}
