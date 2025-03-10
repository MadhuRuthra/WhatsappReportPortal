<?php
/*
This page has some functions which is access from Frontend.
This page is act as a Backend page which is connect with Node JS API and PHP Frontend.
It will collect the form details and send it to API.
After get the response from API, send it back to Frontend.

Version : 1.0
Author : Madhubala (YJ0009)
Date : 01-Jul-2023
*/
session_start(); // start session
error_reporting(E_ALL); // The error reporting function

include_once('../api/configuration.php'); // Include configuration.php
include_once('site_common_functions.php'); // Include site_common_functions.php

extract($_REQUEST); // Extract the request

$bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . ''; // add bearer token
$current_date = date("Y-m-d H:i:s"); // to get the today date
$milliseconds = round(microtime(true) * 1000); // milliseconds in time
$default_variale_msg = '-'; // default msg

// Step 1: Get the current date
$todayDate = new DateTime();
// Step 2: Convert the date to Julian date
$baseDate = new DateTime($todayDate->format('Y-01-01'));
$julianDate = $todayDate->diff($baseDate)->format('%a') + 1; // Adding 1 since the day of the year starts from 0
// Step 3: Output the result in 3-digit format
// echo "Today's Julian date in 3-digit format: " . str_pad($julianDate, 3, '0', STR_PAD_LEFT);
$year = date("Y");
$julian_dates = str_pad($julianDate, 3, '0', STR_PAD_LEFT);
$hour_minutes_seconds = date("His");
$random_generate_three = rand(100, 999);

// Template List Page tmpl_call_function remove_template - Start
if (isset($_GET['tmpl_call_function']) == "remove_template") {
  // Get data
  $template_response_id = htmlspecialchars(strip_tags(isset($_REQUEST['template_response_id']) ? $conn->real_escape_string($_REQUEST['template_response_id']) : ""));
  $change_status = htmlspecialchars(strip_tags(isset($_REQUEST['change_status']) ? $conn->real_escape_string($_REQUEST['change_status']) : ""));
  // To Send the request  API
  $replace_txt = '{
    "template_id" : "' . $template_response_id . '",
    "request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
  }';
  // add bearertoken
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  // It will call "delete_template" API to verify, can we access for the delete_template
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $api_url . '/template/delete_template',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'DELETE',
      CURLOPT_POSTFIELDS => $replace_txt,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        'Content-Type: application/json'

      ),
    )
  );
  // Send the data into API and execute 
  site_log_generate("Template List Page : User : " . $_SESSION['yjwatsp_user_name'] . " send it to Service [$replace_txt] on " . date("Y-m-d H:i:s"), '../');
  $response = curl_exec($curl);
  curl_close($curl);
  // After got response decode the JSON result
  $state1 = json_decode($response, false);
  site_log_generate("Template List Page : User : " . $_SESSION['yjwatsp_user_name'] . " get Service response [$response] on " . date("Y-m-d H:i:s"), '../');

  if ($state1->response_code == 1) {
    site_log_generate("Template List Page : User : " . $_SESSION['yjwatsp_user_name'] . " delete template success on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 1, "msg" => $state1->response_msg);
  } else if ($state1->response_status == 204) {
    site_log_generate("Template List Page : " . $user_name . "get the Service response [$state1->response_status] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 2, "msg" => $state1->response_msg);
  } else {
    if ($state1->response_status == 403 || $response == '') { ?>
        <script>
          window.location = "index"
        </script>
    <? }
    site_log_generate("Template List Page: " . $user_name . " Template List Page [Invalid Inputs] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Template delete failure.");
  }
}
// Template List Page remove_template - End

// Compose SMS Page getSingleTemplate_meta - Start
if (isset($_GET['getSingleTemplate_meta']) == "getSingleTemplate_meta") {

  $tmpl_name = explode('!', $tmpl_name);
  $replace_txt = '';
  // Get data
  $replace_txt = '{"template_name" : "' . $tmpl_name[0] . '","template_lang" : "' . $tmpl_name[1] . '"}';
  // It will call "message_templates" API to verify, can we access for the message_templates
  $curl_get = $api_url . "/template/get_single_template";
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $curl_get,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_SSL_VERIFYPEER => 0,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $replace_txt,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        'Content-Type: application/json'
      ),
    )
  );

  // Send the data into API and execute 
  $yjresponse = curl_exec($curl);
  curl_close($curl);

  site_log_generate("Single template Page: " . $yjresponse . "Page on " . date("Y-m-d H:i:s"), '../');

  // Decode the JSON string
  $data = json_decode($yjresponse, true);
  if ($data->response_status == 403 || $yjresponse == '') { ?>
    <script>
      window.location = "index"
    </script>
  <? }
  // Define the pattern to match the dynamic value
//$pattern = '/te_pri_([a-zA-Z0-9]+)_/';


  // Use preg_match to find the dynamic value
 // if (preg_match($pattern, $tmpl_name[0], $matches)) {
   // echo "coming";
    // The dynamic value will be in $matches[1]
    //$match_code = $matches[1];
  //}


// Split the string by '_' delimiter
$parts = explode('_',  $tmpl_name[0]);

// Access the third element of the resulting array
$template_code = $parts[2];

// Check if the 3rd, 4th, or 5th character of $template_code matches 'i', 'v', or 'd'
if ($template_code[2] === 'i'){
$image_code = 'i';
 }else if($template_code[3] === 'v' ){
  $video_code = 'v';
}else if($template_code[4] === 'd') {
   $document_code = 'd';
}

  // Check if decoding was successful and if the required keys exist
  if ($data !== null && isset($data['data'][0]['components'])) {
    // Access components
    $componentsJson = $data['data'][0]['components'];
    $componentsJson = str_replace('\n', '<br>', $componentsJson);
    // Decode the components JSON string
    $componentsArray = json_decode($componentsJson, true);
    // print_r($componentsArray);

    // Check if decoding of components was successful
    if ($componentsArray !== null) {
      $stateData = '';
      $stateData_box = '';
      $hdr_type = '';
      $flag_media = true;
      // Access the values of the decoded array
      foreach ($componentsArray as $component) {

        if ($component['type'] === 'BODY') {
          // $component['text'] = str_replace('\\n', "\n", $component['text']);
          $hdr_type .= "<input type='hidden' style='margin-left:10px;' name='hid_txt_body_variable' id='hid_txt_body_variable' value='" . $component['text'] . "'>";

          $stateData_1 = '';
          $stateData_1 = nl2br($component['text']);
          $stateData_2 = $stateData_1;

          $matches = null;
          $prmt = preg_match_all("/{{[0-9]+}}/", $component['text'], $matches);
          $matches_a1 = $matches[0];
          rsort($matches_a1);
          sort($matches_a1);
          for ($ij = 0; $ij < count($matches_a1); $ij++) {
            // Looping the ij is less than the count of matches_a1.if the condition is true to continue the process.if the condition are false to stop the process
            $expl2 = explode("{{", $matches_a1[$ij]);
            $expl3 = explode("}}", $expl2[1]);
            $stateData_box = "</div><div style='float:left; padding: 0 5px;'> <input type='text' readonly name='txt_body_variable[$expl3[0]][]' id='txt_body_variable' placeholder='{{" . $expl3[0] . "}} Value' maxlength='20' tabindex='12' title='Enter {{" . $expl3[0] . "}} Value' value='-' style='width:100px;height: 30px;cursor: not-allowed;margin-top:10px;' class='form-control required'> </div><div style='float: left;'>";
            $stateData_1 = str_replace("{{" . $expl3[0] . "}}", $stateData_box, $stateData_1);
            $stateData_2 = $stateData_1;
          }
          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Body : </div><div style='float:left;margin-left:10px;'>" . $stateData_2 . "</div></div>";
          }
        }

        if ($component['type'] == 'HEADER') {
          $hdr_type .= "<input type='hidden' name='hid_txt_header_variable' id='hid_txt_header_variable' value='" . $component['text'] . "'>";
          $stateData_1 = '';
          $stateData_1 = $component['text'];
          $stateData_2 = $stateData_1;

          $matches = null;
          $prmt = preg_match_all("/{{[0-9]+}}/", $component['text'], $matches);
          $matches_a0 = $matches[0];
          rsort($matches_a0);
          sort($matches_a0);
          for ($ij = 0; $ij < count($matches_a0); $ij++) {
            // Looping the ii is less than the count of matches_a0.if the condition is true to continue the process.if the condition are false to stop the process
            $expl2 = explode("{{", $matches_a0[$ij]);
            $expl3 = explode("}}", $expl2[1]);
            $stateData_box = "</div><div style='float:left; padding: 0 5px;'> <input type='text' readonly tabindex='10' name='txt_header_variable[$expl3[0]][]' id='txt_header_variable' placeholder='{{" . $expl3[0] . "}} Value' title='Header Text' maxlength='20' value='-' style='width:100px;height: 30px;cursor: not-allowed;margin-top:10px;' class='form-control required'> </div><div style='float: left;'>";
            $stateData_1 = str_replace("{{" . $expl3[0] . "}}", $stateData_box, $stateData_1);
            $stateData_2 = $stateData_1;
          }

          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
          }
        }

        if ($image_code && $flag_media) {
          $stateData .= "<div id='header' style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;' class='form-control' name='file_image_header' id='file_image_header' tabindex='11' accept='image/png,image/jpg,image/jpeg' data-toggle='tooltip' onfocus='disable_texbox(\"file_image_header\", \"file_image_header_url\")' data-placement='top' data-html='true' title='Upload Any PNG, JPG, JPEG files, below or equal to 5 MB Size' data-original-title='Upload Any PNG, JPG, JPEG files, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;' data-toggle='tooltip' data-placement='top' title='Enter Image URL' data-original-title='Enter Image URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_image_header_url' id='file_image_header_url' maxlength='100' title='Enter Image URL' tabindex='12' onfocus='disable_texbox(\"file_image_header_url\", \"file_image_header\")' placeholder='Enter Image URL'>
    <span class='input-group-addon'><i class='icofont icofont-ui-messaging'></i></span>
  </div>
</div>
</div></div>";
          $flag_media = false;
        } else if ($video_code && $flag_media) {
          $stateData .= "<div id='header' style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;' class='form-control' name='file_video_header' id='file_video_header' tabindex='11' accept='video/mp4' data-toggle='tooltip' onfocus='disable_texbox(\"file_video_header\", \"file_video_header_url\")' data-placement='top' data-html='true' title='Upload Any MP4 file, below or equal to 5 MB Size' data-original-title='Upload Any MP4, MPEG, WEBM file, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;'data-toggle='tooltip' data-placement='top' title='Enter Video URL' data-original-title='Enter Video URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_video_header_url' id='file_video_header_url' maxlength='100' title='Enter Video URL' tabindex='12' onfocus='disable_texbox(\"file_video_header_url\", \"file_video_header\")' placeholder='Enter Video URL'>
    <span class='input-group-addon'><i class='icofont icofont-ui-messaging'></i></span>
  </div>
</div>
</div></div>";
          $flag_media = false;

        } else if ($document_code && $flag_media) {
          $stateData .= "<div id='header' style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;'  class='form-control' name='file_document_header' id='file_document_header' tabindex='11' accept='application/pdf' data-toggle='tooltip' onfocus='disable_texbox(\"file_document_header\", \"file_document_header_url\")' data-placement='top' data-html='true' title='Upload Any PDF file, below or equal to 5 MB Size' data-original-title='Upload Any PDF file, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000 ;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;' data-toggle='tooltip' data-placement='top' title='Enter Document URL' data-original-title='Enter Document URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_document_header_url' id='file_document_header_url' maxlength='100' title='Enter Document URL' onfocus='disable_texbox(\"file_document_header_url\", \"file_document_header\")' tabindex='12' placeholder='Enter Document URL'>
  </div>
</div>
</div></div>";
          $flag_media = false;

        }

        if ($component['type'] === 'BUTTONS') {
          // Loop through buttons
          foreach ($component['buttons'] as $button) {

            $stateData_2 = '';
            if ($button['type'] == 'URL') {
              $stateData_2 .= "<a href='" . $button['url'] . "' target='_blank'>" . $button['text'] . "</a>";
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons URL : </div><div style='float:left'>" . $button['url'] . " - " . $stateData_2 . "</div></div>";
            }

            if ($button['type'] == 'PHONE_NUMBER') { // Phone number
              $stateData_2 .= $button['text'] . " - " . $button['phone_number'];
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons Phone No. : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
            }
            // Looping the kk is less than the count of buttons.if the condition is true to continue the process.if the condition are false to stop the process
            if ($button['type'] == 'QUICK_REPLY') {
              $stateData_2 .= $button['text'];
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons Quick Reply : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
            }

          }

        }

        if ($component['type'] === 'FOOTER') {
          $hdr_type .= "<input type='hidden' name='hid_txt_footer_variable' id='hid_txt_footer_variable' value='" . $component['text'] . "'>";

          $stateData_2 = '';
          $stateData_2 = $component['text'];

          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Footer : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
          }
        }
      }
      site_log_generate("Compose Whatsapp Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " Get Meta Message Template available on " . date("Y-m-d H:i:s"), '../');
      $json = array("status" => 1, "msg" => $stateData . $hdr_type);

    }

  } else {
    // Handle decoding error for main JSON
    site_log_generate("Compose Whatsapp Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " Get Message Template not available on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => '-');
  }

}
// Compose SMS Page getSingleTemplate_meta - End

// Compose SMS Page PreviewTemplate - Start
if (isset($_GET['previewTemplate_meta']) == "previewTemplate_meta") {

 
 /*  $slt_whatsapp_template    = htmlspecialchars(strip_tags(isset($_REQUEST['slt_whatsapp_template']) ? $_REQUEST['slt_whatsapp_template'] : ""));
  $template = explode ("!", $slt_whatsapp_template); 

  $personalization_option     = htmlspecialchars(strip_tags(isset($_REQUEST['personalization_option']) ? $_REQUEST['personalization_option'] : ""));
  $txt_sms_content     = isset($_REQUEST['txt_sms_content']) ? $_REQUEST['txt_sms_content'] : "";

  $txt_list_mobno = str_replace("\\r\\n", '', $txt_list_mobno);

  if($txt_list_mobno != '') {
    // Explode
    $str_arr = explode (",", $txt_list_mobno); 
    $entry_contact = '';
    for($indicatori = 0; $indicatori < count($str_arr); $indicatori++) {
      $entry_contact .= ''.$str_arr[$indicatori].',';
    }
    $entry_contact = rtrim($entry_contact, ", ");
  }

 $file_image_header_url		  = htmlspecialchars(strip_tags(isset($_REQUEST['file_image_header_url']) ? $_REQUEST['file_image_header_url'] : ""));

 $file_video_header_url		  = htmlspecialchars(strip_tags(isset($_REQUEST['file_video_header_url']) ? $_REQUEST['file_video_header_url'] : ""));
 
 $file_document_header_url		  = htmlspecialchars(strip_tags(isset($_REQUEST['file_document_header_url']) ? $_REQUEST['file_document_header_url'] : ""));
 
if($_FILES["fle_variable_csv"]["name"] != '') {
  $path_parts = pathinfo($_FILES["fle_variable_csv"]["name"]);
  $extension = $path_parts['extension'];
  $filename = $_SESSION['yjwatsp_user_id'] . "_csv_" . $milliseconds . "." . $extension;
  $location = "../uploads/group_contact/" . $filename;
  $group_contact = $site_url . "uploads/group_contact/" . $filename;
  $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
  $imageFileType = strtolower($imageFileType);

  $valid_extensions = array("csv");
  $response = 0;
  if (in_array(strtolower($imageFileType), $valid_extensions)) {
    if (move_uploaded_file($_FILES['fle_variable_csv']['tmp_name'], $location)) {
      $response = $location;
    }
  }
}


if ($_FILES["file_image_header"]["name"] != '') {
  $msg_type = 'IMAGE';
  $image_size = $_FILES['file_image_header']['size'];
  $image_type = $_FILES['file_image_header']['type'];
  $file_type = explode("/", $image_type);

  $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
  $location = "../uploads/whatsapp_images/" . $filename;
  $location_1 = $site_url . "uploads/whatsapp_images/" . $filename;
  $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
  $imageFileType = strtolower($imageFileType);

  $rspns = '';
  if (move_uploaded_file($_FILES['file_image_header']['tmp_name'], $location)) {
    $rspns = $location;
    site_log_generate("Create Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_images file moved into Folder on " . date("Y-m-d H:i:s"), '../');
  }
}

if($file_image_header_url){
  $location_1 = $file_image_header_url;
}	


if ($_FILES["file_video_header"]["name"] != '') {
  $msg_type = 'Video';
  $image_size = $_FILES['file_video_header']['size'];
  $image_type = $_FILES['file_video_header']['type'];
  $file_type = explode("/", $image_type);

  $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
  $location = "../uploads/whatsapp_images/" . $filename;
  $location_1 = $site_url . "uploads/whatsapp_images/" . $filename;
  $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
  $imageFileType = strtolower($imageFileType);

  $rspns = '';
  if (move_uploaded_file($_FILES['file_video_header']['tmp_name'], $location)) {
    $rspns = $location;
    site_log_generate("Compose Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_images file moved into Folder on " . date("Y-m-d H:i:s"), '../');
  }
}

if($file_video_header_url){
  $location_1 = $file_video_header_url;
}	

if ($_FILES["file_document_header"]["name"] != '') {
  $msg_type = 'Document';
  $image_size = $_FILES['file_document_header']['size'];
  $image_type = $_FILES['file_document_header']['type'];
  $file_type = explode("/", $image_type);

  $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
  $location = "../uploads/whatsapp_images/" . $filename;
  $location_1 = $site_url . "uploads/whatsapp_images/" . $filename;
  $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
  $imageFileType = strtolower($imageFileType);


  $rspns = '';
  if (move_uploaded_file($_FILES['file_document_header']['tmp_name'], $location)) {
    $rspns = $location;
    site_log_generate("Create Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_images file moved into Folder on " . date("Y-m-d H:i:s"), '../');
  }
}

if($file_document_header_url){
  $location_1 = $file_document_header_url;
}	
  ?>
	<table class="table table-striped table-bordered m-0" style="table-layout: fixed; white-space: inherit; width: 100%; overflow-x: scroll;">
				<tbody>
          <? if($template != '' ) { ?>
						<tr>
								<th scope="row">Select Whatsapp Template</th>
								<td style="white-space: inherit !important;"><?= $template[0] . "[" .$template[1] . "]" ?></td>
						</tr>
					<? } ?>
          <? if($personalization_option != '' && $template[4] ) { ?>
						<tr>
								<th scope="row"></th>
								<td style="white-space: inherit !important;"><?= $personalization_option?></td>
						</tr>
					<? } ?>

					<? if($entry_contact != '') { ?>
						<tr>
								<th scope="row">Enter Mobile Numbers</th>
								<td style="white-space: inherit !important;"><?=$entry_contact?></td>
						</tr>
					<? } ?>
          <? if($location_1 != '' ) { ?>
						<tr>
								<th scope="row">Header Media</th>
								<td style="white-space: inherit !important;"><a href= "<?=$location_1?>"  target='_blank'>Media Link</a></td>
						</tr>
					<? } ?>
          <? if($group_contact != '') { ?>
						<tr>
								<th scope="row">Upload Mobile Numbers</th>
								<td style="white-space: inherit !important;"><a href= "<?=$group_contact?>"  target='_blank'>Download Mobile Numbers</a></td>
						</tr>
					<? } ?>
				</tbody>
		</table>
	<? */
  

  $tmpl_name = explode('!', $tmpl_name);
  $template_name = $tmpl_name[0];
  $replace_txt = '';
  // Get data
  $replace_txt = '{"template_name" : "' . $tmpl_name[0] . '","template_lang" : "' . $tmpl_name[1] . '"}';
  // It will call "message_templates" API to verify, can we access for the message_templates
  $curl_get = $api_url . "/template/get_single_template";
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $curl_get,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_SSL_VERIFYPEER => 0,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $replace_txt,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        'Content-Type: application/json'
      ),
    )
  );

  // Send the data into API and execute 
  $yjresponse = curl_exec($curl);
  curl_close($curl);

  site_log_generate("Single template Page: " . $yjresponse . "Page on " . date("Y-m-d H:i:s"), '../');

  // Decode the JSON string
  $data = json_decode($yjresponse, true);
  if ($data->response_status == 403 || $yjresponse == '') { ?>
    <script>window.location = "index"</script>
  <? }
// Split the string by '_' delimiter
$parts = explode('_',  $tmpl_name[0]);

// Access the third element of the resulting array
$template_code = $parts[2];

// Check if the 3rd, 4th, or 5th character of $template_code matches 'i', 'v', or 'd'
if ($template_code[2] === 'i'){
$image_code = 'i';
 }else if($template_code[3] === 'v' ){
  $video_code = 'v';
}else if($template_code[4] === 'd') {
   $document_code = 'd';
}

  // Check if decoding was successful and if the required keys exist
  if ($data !== null && isset($data['data'][0]['components'])) {
    // Access components
    $componentsJson = $data['data'][0]['components'];
    $componentsJson = str_replace('\n', '<br>', $componentsJson);
    // Decode the components JSON string
    $componentsArray = json_decode($componentsJson, true);
    // print_r($componentsArray);

    // Check if decoding of components was successful
    if ($componentsArray !== null) {
      $stateData = '';
      $stateData_box = '';
      $hdr_type = '';
      $flag_media = true;
      // Access the values of the decoded array
      foreach ($componentsArray as $component) {

        if ($component['type'] === 'BODY') {
          // $component['text'] = str_replace('\\n', "\n", $component['text']);
          $hdr_type .= "<input type='hidden' style='margin-left:10px;' name='hid_txt_body_variable' id='hid_txt_body_variable' value='" . $component['text'] . "'>";

          $stateData_1 = '';
          $stateData_1 = nl2br($component['text']);
          $stateData_2 = $stateData_1;

          $matches = null;
          $prmt = preg_match_all("/{{[0-9]+}}/", $component['text'], $matches);
          $matches_a1 = $matches[0];
          rsort($matches_a1);
          sort($matches_a1);
          for ($ij = 0; $ij < count($matches_a1); $ij++) {
            // Looping the ij is less than the count of matches_a1.if the condition is true to continue the process.if the condition are false to stop the process
            $expl2 = explode("{{", $matches_a1[$ij]);
            $expl3 = explode("}}", $expl2[1]);
            $stateData_box = "</div><div style='float:left; padding: 0 5px;'> <input type='text' readonly name='txt_body_variable[$expl3[0]][]' id='txt_body_variable' placeholder='{{" . $expl3[0] . "}} Value' maxlength='20' tabindex='12' title='Enter {{" . $expl3[0] . "}} Value' value='-' style='width:100px;height: 30px;cursor: not-allowed;margin-top:10px;' class='form-control required'> </div><div style='float: left;'>";
            $stateData_1 = str_replace("{{" . $expl3[0] . "}}", $stateData_box, $stateData_1);
            $stateData_2 = $stateData_1;
          }
          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Body : </div><div style='float:left;margin-left:10px;'>" . $stateData_2 . "</div></div>";
          }
        }

        if ($component['type'] == 'HEADER') {
          $hdr_type .= "<input type='hidden' name='hid_txt_header_variable' id='hid_txt_header_variable' value='" . $component['text'] . "'>";

          $stateData_1 = '';
          $stateData_1 = $component['text'];
          $stateData_2 = $stateData_1;

          $matches = null;
          $prmt = preg_match_all("/{{[0-9]+}}/", $component['text'], $matches);
          $matches_a0 = $matches[0];
          rsort($matches_a0);
          sort($matches_a0);
          for ($ij = 0; $ij < count($matches_a0); $ij++) {
            // Looping the ii is less than the count of matches_a0.if the condition is true to continue the process.if the condition are false to stop the process
            $expl2 = explode("{{", $matches_a0[$ij]);
            $expl3 = explode("}}", $expl2[1]);
            $stateData_box = "</div><div style='float:left; padding: 0 5px;'> <input type='text' readonly tabindex='10' name='txt_header_variable[$expl3[0]][]' id='txt_header_variable' placeholder='{{" . $expl3[0] . "}} Value' title='Header Text' maxlength='20' value='-' style='width:100px;height: 30px;cursor: not-allowed;margin-top:10px;' class='form-control required'> </div><div style='float: left;'>";
            $stateData_1 = str_replace("{{" . $expl3[0] . "}}", $stateData_box, $stateData_1);
            $stateData_2 = $stateData_1;
          }

          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
          }
        }

        if ($image_code && $flag_media) {
          $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;' class='form-control' name='file_image_header' id='file_image_header' disabled tabindex='11' accept='image/png,image/jpg,image/jpeg' data-toggle='tooltip' onfocus='disable_texbox(\"file_image_header\", \"file_image_header_url\")' data-placement='top' data-html='true' title='Upload Any PNG, JPG, JPEG files, below or equal to 5 MB Size' data-original-title='Upload Any PNG, JPG, JPEG files, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;' data-toggle='tooltip' data-placement='top' title='Enter Image URL' data-original-title='Enter Image URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_image_header_url' id='file_image_header_url' maxlength='100' title='Enter Image URL' readonly tabindex='12' onfocus='disable_texbox(\"file_image_header_url\", \"file_image_header\")' placeholder='Enter Image URL'>
    <span class='input-group-addon'><i class='icofont icofont-ui-messaging'></i></span>
  </div>
</div>
</div></div>";
          $flag_media = false;
        } else if ($video_code && $flag_media) {
          $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;' class='form-control' name='file_video_header' id='file_video_header' tabindex='11' disabled accept='video/mp4' data-toggle='tooltip' onfocus='disable_texbox(\"file_video_header\", \"file_video_header_url\")' data-placement='top' data-html='true' title='Upload Any MP4 file, below or equal to 5 MB Size' data-original-title='Upload Any MP4, MPEG, WEBM file, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;'data-toggle='tooltip' data-placement='top' title='Enter Video URL' data-original-title='Enter Video URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_video_header_url' id='file_video_header_url' maxlength='100' title='Enter Video URL' tabindex='12' onfocus='disable_texbox(\"file_video_header_url\", \"file_video_header\")' placeholder='Enter Video URL' readonly>
    <span class='input-group-addon'><i class='icofont icofont-ui-messaging'></i></span>
  </div>
</div>
</div></div>";
          $flag_media = false;

        } else if ($document_code && $flag_media) {
          $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Header : </div><div style='float:left'><input type='file' style='margin-left:10px;'  class='form-control' name='file_document_header' id='file_document_header' tabindex='11' accept='application/pdf' disabled data-toggle='tooltip' onfocus='disable_texbox(\"file_document_header\", \"file_document_header_url\")' data-placement='top' data-html='true' title='Upload Any PDF file, below or equal to 5 MB Size' data-original-title='Upload Any PDF file, below or equal to 5 MB Size'></div><div style='float:left'><span style='color:#FF0000 ;margin-left:20px;'>[OR]</span></div><div style='float:left'><div class='' style='margin-left:10px;' data-toggle='tooltip' data-placement='top' title='Enter Document URL' data-original-title='Enter Document URL'>
  <div class='input-group'>
    <input class='form-control form-control-primary' type='url' name='file_document_header_url' id='file_document_header_url' maxlength='100' title='Enter Document URL' onfocus='disable_texbox(\"file_document_header_url\", \"file_document_header\")' tabindex='12' placeholder='Enter Document URL' readonly>
  </div>
</div>
</div></div>";
          $flag_media = false;

        }

        if ($component['type'] === 'BUTTONS') {
          // Loop through buttons
          foreach ($component['buttons'] as $button) {

            $stateData_2 = '';
            if ($button['type'] == 'URL') {
              $stateData_2 .= "<a href='" . $button['url'] . "' target='_blank'>" . $button['text'] . "</a>";
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons URL : </div><div style='float:left'>" . $button['url'] . " - " . $stateData_2 . "</div></div>";
            }

            if ($button['type'] == 'PHONE_NUMBER') { // Phone number
              $stateData_2 .= $button['text'] . " - " . $button['phone_number'];
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons Phone No. : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
            }
            // Looping the kk is less than the count of buttons.if the condition is true to continue the process.if the condition are false to stop the process
            if ($button['type'] == 'QUICK_REPLY') {
              $stateData_2 .= $button['text'];
              $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Buttons Quick Reply : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
            }

          }

        }

        if ($component['type'] === 'FOOTER') {
          $hdr_type .= "<input type='hidden' name='hid_txt_footer_variable' id='hid_txt_footer_variable' value='" . $component['text'] . "'>";

          $stateData_2 = '';
          $stateData_2 = $component['text'];

          if ($stateData_2 != '') {
            $stateData .= "<div style='float:left; clear:both; line-height: 36px;'><div style='float:left; line-height: 36px;'>Footer : </div><div style='float:left'>" . $stateData_2 . "</div></div>";
          }
        }
      }

      site_log_generate("Compose Whatsapp Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " Get Meta Message Template available on " . date("Y-m-d H:i:s"), '../');
      $json = array("status" => 1, "msg" => $stateData . $hdr_type);

    }
  } else {
    // Handle decoding error for main JSON
    site_log_generate("Compose Whatsapp Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " Get Message Template not available on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => '-');
  }
}
// Compose SMS Page PreviewTemplate - End

// Compose SMS Page validateMobno - Start
if (isset($_POST['validateMobno']) == "validateMobno") {
  // Get data
  $mobno = str_replace('"', '', htmlspecialchars(strip_tags(isset($_POST['mobno']) ? $conn->real_escape_string($_POST['mobno']) : "")));
  $dup = htmlspecialchars(strip_tags(isset($_POST['dup']) ? $conn->real_escape_string($_POST['dup']) : ""));
  $inv = htmlspecialchars(strip_tags(isset($_POST['inv']) ? $conn->real_escape_string($_POST['inv']) : ""));
  // To validate the mobile number
  $mobno = str_replace('\n', ',', $mobno);
  $newline = explode('\n', $mobno);
  $correct_mobno_data = [];
  $return_mobno_data = '';
  $issu_mob = '';
  $cnt_vld_no = 0;
  $max_vld_no = 2000000;
  for ($i = 0; $i < count($newline); $i++) {
    // Looping the i is less than the count of newline.if the condition is true to continue the process.if the condition are false to stop the process
    $expl = explode(",", $newline[$i]);
    // Looping  with in the looping the ij is less than the count of expl.if the condition is true to continue the process.if the condition are false to stop the process
    for ($ij = 0; $ij < count($expl); $ij++) {
      if ($inv == 1) {
        $vlno = validate_phone_number($expl[$ij]);
      } else {
        $vlno = $newline[$i];
      }

      if ($vlno == true) {
        if ($dup == 1) {
          if (!in_array($expl[$ij], $correct_mobno_data)) {
            if ($expl[$ij] != '') {
              $cnt_vld_no++;
              if ($cnt_vld_no <= $max_vld_no) {
                $correct_mobno_data[] = $expl[$ij];
                $return_mobno_data .= $expl[$ij] . ",\n";
              } else {
                $issu_mob .= $expl[$ij] . ",";
              }
            } else {
              $issu_mob .= $expl[$ij] . ",";
            }
          } else {
            $issu_mob .= $expl[$ij] . ",";
          }
        } else {
          if ($expl[$ij] != '') {
            $cnt_vld_no++;
            if ($cnt_vld_no <= $max_vld_no) {
              $correct_mobno_data[] = $expl[$ij];
              $return_mobno_data .= $expl[$ij] . ",\n";
            } else {
              $issu_mob .= $expl[$ij] . ", ";
            }
          } else {
            $issu_mob .= $expl[$ij] . ", ";
          }
        }
      } else {
        $issu_mob .= $expl[$ij] . ",";
      }
    }
  }

  $return_mobno_data = rtrim($return_mobno_data, ",\n");
  $json = array("status" => 1, "msg" => $return_mobno_data . "||" . $issu_mob);
}
// Compose SMS Page validateMobno - End

// Compose Whatsapp Page compose_whatsapp - Start
if ($_SERVER['REQUEST_METHOD'] == "GET" and $tmpl_call_function == "compose_whatsapp") {
  site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [GET NOT ALLOWED] on " . date("Y-m-d H:i:s"), '../');
  $json = array("status" => 0, "msg" => "Get Method not allowed here!");
}
if ($_SERVER['REQUEST_METHOD'] == "POST" and $tmpl_call_function == "compose_whatsapp") {
  site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " access this page on " . date("Y-m-d H:i:s"), '../');
  // Get data
  $txt_list_mobno = htmlspecialchars(strip_tags(isset($_REQUEST['txt_list_mobno']) ? $_REQUEST['txt_list_mobno'] : ""));

  if (isset($txt_header_variable)) {
    for ($i1 = 1; $i1 <= count($txt_header_variable); $i1++) {
      // Looping the i1 is less than the count of txt_header_variable.if the condition is true to continue the process.if the condition are false to stop the process
      $stateData_1 = '';
      $stateData_1 = $hid_txt_header_variable;

      $matches = null;
      $prmt = preg_match_all("/{{[0-9]+}}/", $hid_txt_header_variable, $matches);
      $matches_a0 = $matches[0];
      rsort($matches_a0);
      sort($matches_a0);
      // Looping  with in the looping the ij is less than the count of matches_a0.if the condition is true to continue the process.if the condition are false to stop the process
      for ($ij = 0; $ij < count($matches_a0); $ij++) {
        $expl2 = explode("{{", $matches_a0[$ij]);
        $expl3 = explode("}}", $expl2[1]);
        $stateData_1 = str_replace("{{" . $expl3[0] . "}}", $txt_header_variable[$i1][0], $stateData_1);
      }

      $header_details = $stateData_1;
    }
  }

  $sendto_api = '{';

  $matches_a1 = [];
  if (isset($txt_body_variable) || (isset($_POST['personalization_option']) && $_POST['personalization_option'] == 'personalized')) {
    $path_parts = pathinfo($_FILES["fle_variable_csv"]["name"]);
    $extension = $path_parts['extension'];
    $filename = $_SESSION['yjwatsp_user_id'] . "_csv_" . $milliseconds . "." . $extension;
    /* Location */
    $location = "../uploads/compose_variables/" . $filename;
    $file_location = $full_pathurl."uploads/compose_variables/". $filename;
    $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
    $imageFileType = strtolower($imageFileType);

    /* Valid extensions */
    $valid_extensions = array("csv");
    $response = 0;
    /* Check file extension */
    if (in_array(strtolower($imageFileType), $valid_extensions)) {
      /* Upload file */
      if (move_uploaded_file($_FILES['fle_variable_csv']['tmp_name'], $location)) {
        $response = $location;
      }
    }

    $csvFile = fopen($location, 'r') or die("can't open file");

    $sendto_api .= '              
      "user_id":"' . $_SESSION['yjwatsp_user_id'] . '",
    "file_location": "' .$file_location . '",
	"message_type": "' . ($_POST['personalization_option'] == 'personalized' ? 'personalised' : 'non_personalised') . '",';
  }else{ 
    
  // Receiver Mobile Numbers
  $newline1 = explode("\n", $txt_list_mobno);
  $receive_mobile_nos = '';
  $cnt_mob_no = count($newline1);
  for ($i1 = 0; $i1 < count($newline1); $i1++) {
    // Looping the i1 is less than the count of newline1.if the condition is true to continue the process.if the condition are false to stop the process
    $expl1 = explode(",", $newline1[$i1]);
    for ($ij1 = 0; $ij1 < count($expl1); $ij1++) {
      // Looping  with in the looping the ij1 is less than the count of expl1.if the condition is true to continue the process.if the condition are false to stop the process
      if (validate_phone_number($expl1[$ij1])) {
        $mblno[] = $expl1[$ij1];
        $receive_mobile_nos .= $expl1[$ij1] . ',';
      }
    }
    $ttl_sms_cnt = count($mblno);
  }
  $receive_mobile_nos = rtrim($receive_mobile_nos, ",");

    $sendto_api .= '          
    "user_id":"' . $_SESSION['yjwatsp_user_id'] . '",
    "receiver_numbers":[' . $receive_mobile_nos . '],';

    $ttl_sms_cnt = count($mblno);

  }

  // Get data
 
  $chk_remove_duplicates = htmlspecialchars(strip_tags(isset($_REQUEST['chk_remove_duplicates']) ? $_REQUEST['chk_remove_duplicates'] : ""));
  $chk_remove_invalids = htmlspecialchars(strip_tags(isset($_REQUEST['chk_remove_invalids']) ? $_REQUEST['chk_remove_invalids'] : ""));
  $id_slt_contgrp = htmlspecialchars(strip_tags(isset($_REQUEST['id_slt_contgrp']) ? $_REQUEST['id_slt_contgrp'] : "0"));
  $txt_sms_type = htmlspecialchars(strip_tags(isset($_REQUEST['txt_sms_type']) ? $_REQUEST['txt_sms_type'] : "TEXT"));
  $txt_sms_type = strtoupper($txt_sms_type);
  $country_code = '';
  $mime_type = '';
  $id_slt_mobileno = htmlspecialchars(strip_tags(isset($_REQUEST['id_slt_mobileno']) ? $_REQUEST['id_slt_mobileno'] : "0"));
  $expl_id_slt_mobileno = explode('||', $id_slt_mobileno);
  $id_slt_mobileno = $expl_id_slt_mobileno[2];
  $wht_tmplsend_url = $expl_id_slt_mobileno[3];
  $wht_tmpl_url = $expl_id_slt_mobileno[1];
  $wht_bearer_token = $expl_id_slt_mobileno[0];
  $filename = '';
  if ($_FILES['txt_media']['name'] != '') { // file name
    $path_parts = pathinfo($_FILES["txt_media"]["name"]);
    $extension = $path_parts['extension'];
    $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $extension;

    /* Location */
    $location = "../uploads/whatsapp_media/" . $filename;
    $send_location = realpath($_SERVER["DOCUMENT_ROOT"]) . "/whatsapp/uploads/whatsapp_media/" . $filename;
    $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
    $imageFileType = strtolower($imageFileType);

    switch ($imageFileType) {
      case 'jpg':
      case 'jpeg':
        $mime_type = "image/jpeg";
        break;
      case 'png':
        $mime_type = "image/png";
        break;
      case 'gif':
        $mime_type = "image/gif";
        break;

      case 'pdf':
        $mime_type = "application/pdf";
        break;
      case 'mp4':
        $mime_type = "video/mp4";
        break;
      case 'webm':
        $mime_type = "video/webm";
        break;
    }

    /* Valid extensions */
    $valid_extensions = array("jpg", "jpeg", "png", "pdf", "gif", "mp4", "webm");

    $rspns = '';
    /* Check file extension */
    /* Upload file */
    if (move_uploaded_file($_FILES['txt_media']['tmp_name'], $location)) {
      site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_media file moved into Folder on " . date("Y-m-d H:i:s"), '../');
    }
    // }
  } else {
    $filename = '';
  }
  // Get data
  $txt_sms_content = htmlspecialchars(strip_tags(isset($_REQUEST['txt_sms_content']) ? $_REQUEST['txt_sms_content'] : ""));
  $txt_caption = htmlspecialchars(strip_tags(isset($_REQUEST['txt_caption']) ? $_REQUEST['txt_caption'] : "Media"));
  $txt_char_count = htmlspecialchars(strip_tags(isset($_REQUEST['txt_char_count']) ? $_REQUEST['txt_char_count'] : "1"));
  $txt_sms_count = htmlspecialchars(strip_tags(isset($_REQUEST['txt_sms_count']) ? $_REQUEST['txt_sms_count'] : "1"));
  $txt_rcscard_title = htmlspecialchars(strip_tags(isset($_REQUEST['txt_rcscard_title']) ? $_REQUEST['txt_rcscard_title'] : ""));
  $chk_save_contact_group = htmlspecialchars(strip_tags(isset($_REQUEST['chk_save_contact_group']) ? $_REQUEST['chk_save_contact_group'] : ""));

  $expl_wht = explode("~~", $txt_whatsapp_mobno[0]);
  $storeid = $expl_wht[0];
  $confgid = $expl_wht[1];


  //   // Sender Mobile Numbers
//   $sender_mobile_nos = '';
//   for ($i1 = 0; $i1 < count($txt_whatsapp_mobno); $i1++) {
//  // Looping the i1 is less than the count of txt_whatsapp_mobno.if the condition is true to continue the process.if the condition are false to stop the process
//     $ex1 = explode('~~', $txt_whatsapp_mobno[$i1]);
//     $sender_mobile_nos .= $ex1[2] . ',';
//   }
//   $sender_mobile_nos = rtrim($sender_mobile_nos, ",");

  $txt_sms_content = substr($txt_sms_content, 0, 1000);
  /* if (strlen($txt_sms_content) != mb_strlen($txt_sms_content, 'utf-8')) {
    $txt_char_count = mb_strlen($txt_sms_content, 'utf-8');
    $txt_sms_count = ceil($txt_char_count / 70);
  } else { */
    $txt_char_count = strlen($txt_sms_content);
    $txt_sms_count = ceil($txt_char_count / 160);
  // }

  $usr_id = $_SESSION['yjwatsp_user_id'];
  // To Send the request  API
  $replace_txt = '{
    "user_id" : "' . $usr_id . '"
  }';
  //add bearer token
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  // It will call "available_credits" API to verify, can we access for the available_credits
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $api_url . '/list/available_credits',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_POSTFIELDS => $replace_txt,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        'Content-Type: application/json'

      ),
    )
  );
  // Send the data into API and execute 
  site_log_generate("Compose Whatsapp Page : " . $_SESSION['yjwatsp_user_name'] . " Execute the service [$replace_txt] on " . date("Y-m-d H:i:s"), '../');
  $response = curl_exec($curl);
  curl_close($curl);
  // After got response decode the JSON result
  $header = json_decode($response, false);
  site_log_generate("Compose Whatsapp Page : " . $_SESSION['yjwatsp_user_name'] . " get the Service response [$response] on " . date("Y-m-d H:i:s"), '../');


  if ($header->num_of_rows > 0) {
    for ($indicator = 0; $indicator < $header->num_of_rows; $indicator++) {
      // Looping the indicator is less than the num_of_rows.if the condition is true to continue the process.if the condition are false to stop the process
      $alotsms = $header->report[$indicator]->available_messages;
      $expdate = date("Y-m-d H:i:s", strtotime($header->report[$indicator]->expiry_date));
    }
  } else if ($header->response_status == 403 || $response == '') { ?>
      <script>
        window.location = "index"
      </script>
  <? } else {
    $alotsms = 0;
    $expdate = '';
  }


  $ttlmsgcnt = 0;
  if ($txt_sms_content != '') {
    $ttlmsgcnt++;
  }
  if ($filename != '') {
    $ttlmsgcnt++;
  }
  if ($txt_open_url != '' or $txt_call_button != '' or (count($txt_reply_buttons) > 0 and $txt_reply_buttons[0] != '')) {
    $ttlmsgcnt++;
  }
  if (count($txt_option_list) > 0 and $txt_option_list[0] != '') {
    $ttlmsgcnt++;
  }


  // allocate the credits 
  if ($alotsms == 0 and $_SESSION['yjwatsp_user_master_id'] != 1) {
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [Whatsapp Credits are not available..] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Whatsapp Credits are not available. Kindly verify!!");
  } elseif ($alotsms < $ttl_sms_cnt and $_SESSION['yjwatsp_user_master_id'] != 1) {
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [Whatsapp Credits are not available.] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Whatsapp Credits are not available. Kindly verify!!");
  } elseif ($txt_char_count > 1000) {
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [Morethan 1000 characters are not allowed for Whatsapp] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Morethan 1000 characters are not allowed for Whatsapp. Kindly verify!!");
  } elseif ($expdate == '' and $_SESSION['yjwatsp_user_master_id'] != 1) {
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [Validity Period Expired.] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Validity Period Expired. Kindly verify!");
  } elseif (strtotime($expdate) < strtotime($current_date) and $_SESSION['yjwatsp_user_master_id'] != 1) {
//echo "@@@@";
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " Compose Whatsapp failed [Validity Period Expired..] on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 0, "msg" => "Validity Period Expired. Kindly verify!!");
  } else { // otherwise
    // Send Whatsapp Message - Start
    $tmpl_name1 = explode('!', $slt_whatsapp_template);

//echo "!!!!";

    $whatsapp_tmpl_hdtext = '';
    $whatsapp_tmpl_body = '';
    $whatsapp_tmpl_footer = '';
    $whtsap_send = '';

//echo "######";


//    if (isset($_FILES['file_document_header']['name']) or $file_document_header_url != '') {
	if (isset($_POST['personalization_option']) && $_POST['personalization_option'] != 'personalized' && (isset($_FILES['file_document_header']['name']) || !empty($file_document_header_url)))
    {

      if (isset($_FILES['file_document_header']['name'])) {

          $image_size = $_FILES['file_document_header']['size'];
          $image_type = $_FILES['file_document_header']['type'];
          $file_type = explode("/", $image_type);

          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
        /* Location */
        $location = "../uploads/whatsapp_docs/" . $filename;
        $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
        $imageFileType = strtolower($imageFileType);

        /* Valid extensions */
        $valid_extensions = array("pdf");

        $rspns = '';
        /* Check file extension */
        if (in_array(strtolower($imageFileType), $valid_extensions)) {
          /* Upload file */
          if (move_uploaded_file($_FILES['file_document_header']['tmp_name'], $location)) {
            $rspns = $location;
            site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_docs file moved into Folder on " . date("Y-m-d H:i:s"), '../');
          }
        }

        $sendto_api .= '"link": "' . $site_url . 'uploads/whatsapp_docs/' . $filename . '",';

      } elseif ($file_document_header_url != '') {
        $sendto_api .= '"link": "' . $file_document_header_url . '",';
      }

    }

//echo "$$$$$";
//echo((isset($_POST['personalization_option']) && $_POST['personalization_option'] != 'personalized' && (isset($_FILES['file_image_header']['name']) || !empty($file_image_header_url))));

   // if (isset($_FILES['file_image_header']['name']) or $file_image_header_url != '') {
      if (isset($_POST['personalization_option']) && $_POST['personalization_option'] != 'personalized' && (isset($_FILES['file_image_header']['name']) || !empty($file_image_header_url)))
      {
	//echo "!!!11";

      if (isset($_FILES['file_image_header']['name'])) {

          $image_size = $_FILES['file_image_header']['size'];
          $image_type = $_FILES['file_image_header']['type'];
          $file_type = explode("/", $image_type);

          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];

        /* Location */
        $location = "../uploads/whatsapp_images/" . $filename;
        $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
        $imageFileType = strtolower($imageFileType);

        /* Valid extensions */
        $valid_extensions = array("png", "jpg", "jpeg");

        $rspns = '';
        /* Check file extension */
        if (in_array(strtolower($imageFileType), $valid_extensions)) {
          /* Upload file */
          if (move_uploaded_file($_FILES['file_image_header']['tmp_name'], $location)) {
            $rspns = $location;
            site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_images file moved into Folder on " . date("Y-m-d H:i:s"), '../');
          }
        }

        $sendto_api .= '"link": "' . $site_url . 'uploads/whatsapp_images/' . $filename . '",';

      } elseif ($file_image_header_url != '') {
        $sendto_api .= '"link": "' . $file_image_header_url . '",';
      }
    }

   // if (isset($_FILES['file_video_header']['name']) or $file_video_header_url != '') {
    if (isset($_POST['personalization_option']) && $_POST['personalization_option'] != 'personalized' && (isset($_FILES['file_video_header']['name']) || !empty($file_video_header_url)))
      {

      if (isset($_FILES['file_video_header']['name'])) {

   $image_size = $_FILES['file_video_header']['size'];
          $image_type = $_FILES['file_video_header']['type'];
          $file_type = explode("/", $image_type);

          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];

        /* Location */
        $location = "../uploads/whatsapp_videos/" . $filename;
        $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
        $imageFileType = strtolower($imageFileType);

        /* Valid extensions */
        $valid_extensions = array("mp4");

        $rspns = '';
        /* Check file extension */
        if (in_array(strtolower($imageFileType), $valid_extensions)) {
          /* Upload file */
          if (move_uploaded_file($_FILES['file_video_header']['tmp_name'], $location)) {
            $rspns = $location;
            site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_videos file moved into Folder on " . date("Y-m-d H:i:s"), '../');
          }
        }

        $sendto_api .='"link": "' . $site_url . 'uploads/whatsapp_videos/' . $filename . '",';

      } elseif ($file_video_header_url != '') {
        $sendto_api .= '"link": "' . $file_video_header_url . '",';
      }
    }

    $whtsap_send .= '[
                  {
                      "type": "HEADER",
                      "parameters": [
                          {
                              "type": "text",
                              "text": "' . $hid_txt_header_variable . '"
                          }
                      ]
                  },
                  {
                    "type": "BODY",
                    "parameters": [
                        {
                            "type": "text",
                            "text": "' . $hid_txt_body_variable . '"
                        }
                    ]
                  },';
  }
  $whtsap_send = rtrim($whtsap_send, ",");
  $whtsap_send .= ']';

  $whatsapp_tmpl_hdtext = $header_details;
  $whatsapp_tmpl_body = $body_details;
  $whatsapp_tmpl_footer = $yjresponseobj->data[0]->components[2]->text;


  $whtsap_send = rtrim($whtsap_send, ",");
  $whtsap_send = str_replace('""', '[]', $whtsap_send);
  $whatsapp_tmpl_body = $whtsap_send;
  $expld1 = explode("!", $slt_whatsapp_template);
  if ($whtsap_send == '[]]') {
    $whtsap_send = str_replace('""', '[]]', "[]");
  }

    $sendto_api .= '"store_id":"1",
                        "template_id":"' . $expld1[3] . '",
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
                      }';

//echo $sendto_api;
//exit;

//echo  $sendto_api;
  site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " api send text [$sendto_api] on " . date("Y-m-d H:i:s"), '../');
  // add bearer token
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  // It will call "compose_whatsapp_message" API to verify, can we access for thecompose_whatsapp_message
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $api_url . '/compose_whatsapp_message',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $sendto_api,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        "cache-control: no-cache",
        'Content-Type: application/json; charset=utf-8'

      ),
    )
  );
  // Send the data into API and execute 
  $response = curl_exec($curl);
  curl_close($curl);
  // After got response decode the JSON result
  $respobj = json_decode($response);
  site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " api send text - Response [$response] on " . date("Y-m-d H:i:s"), '../');

  $rsp_id = $respobj->response_status;
  if ($respobj->data[0] != '') {
    $rsp_msg_1 = strtoupper($respobj->data[0]);
  } else {
    $rsp_msg = strtoupper($respobj->response_msg);
  }

  if ($rsp_id == 203) {
    $json = array("status" => 2, "msg" => "Invalid User, Kindly try again with Valid User!!");
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " [Invalid User, Kindly try again with Valid User!!] on " . date("Y-m-d H:i:s"), '../');
  } else if ($rsp_id == 201) {
    $json = array("status" => 0, "msg" => "Failure - $rsp_msg");
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " [Failure - $rsp_msg] on " . date("Y-m-d H:i:s"), '../');
  } else {
    if ($respobj->response_status == 403 || $response == '') { ?>
        <script>
          window.location = "index"
        </script>
    <? }
    $json = array("status" => 1, "msg" => "Campaign Name Created Successfully!!");
    site_log_generate("Compose Whatsapp Page : User : " . $_SESSION['yjwatsp_user_name'] . " [Success] on " . date("Y-m-d H:i:s"), '../');
  }

}

// Compose Whatsapp Page compose_whatsapp - End

// Create Template create_template - Start
if ($_SERVER['REQUEST_METHOD'] == "POST" and $temp_call_function == "create_template") {
  // Get data
  $categories = htmlspecialchars(strip_tags(isset($_REQUEST['categories']) ? $conn->real_escape_string($_REQUEST['categories']) : ""));
  $textarea = htmlspecialchars(strip_tags(isset($_REQUEST['textarea']) ? $conn->real_escape_string($_REQUEST['textarea']) : ""));

  $textarea = str_replace("'", "\'", $textarea);
  $textarea = str_replace('"', '\"', $textarea);
  $textarea = str_replace("\\r\\n", '\n', $textarea);
  $textarea = str_replace('&amp;', '&', $textarea);
  $textarea = str_replace(PHP_EOL, '\n', $textarea);

  $txt_header_name = htmlspecialchars(strip_tags(isset($_REQUEST['txt_header_name']) ? $conn->real_escape_string($_REQUEST['txt_header_name']) : ""));
  $txt_footer_name = htmlspecialchars(strip_tags(isset($_REQUEST['txt_footer_name']) ? $conn->real_escape_string($_REQUEST['txt_footer_name']) : ""));
  $media_category = htmlspecialchars(strip_tags(isset($_REQUEST['media_category']) ? $conn->real_escape_string($_REQUEST['media_category']) : ""));
  $txt_header_variable = htmlspecialchars(strip_tags(isset($_REQUEST['txt_header_variable']) ? $conn->real_escape_string($_REQUEST['txt_header_variable']) : ""));
  // To get the one by one data from the array
  foreach ($lang as $lang_id) {
    $langid .= $lang_id . "";
  }
  $language = explode("-", $langid);
  $language_code = $language[0];
  $language_id = $language[1];
  if ($language_code == 'en_GB' || $language_code == 'en_US') {
    $code .= "t";
  } else {
    $code .= "l";
  }
  $user_id = $_SESSION['yjwatsp_user_id'];
  foreach ($select_action1 as $slt_action1) {
    $slt_action_1 .= '"' . $slt_action1 . '"';
  }
  foreach ($select_action4 as $slt_action4) {
    $slt_action_4 .= '"' . $slt_action4 . '"';
  }
  foreach ($select_action5 as $slt_action5) {
    $slt_action_5 .= '"' . $slt_action5 . '"';
  }
  foreach ($select_action3 as $slt_action3) {
    $slt_action_3 .= '"' . $slt_action3 . '"';
  }
  foreach ($website_url as $web_url) {
    $web_url_link .= $web_url;

  }
  foreach ($button_url_text as $btn_txt_url) {
    $btn_txt_url_name .= $btn_txt_url;

  }
  foreach ($button_txt_phone_no as $btn_txt_phn) {
    $btn_txt_phn_no .= $btn_txt_phn;

  }
  foreach ($button_text as $btn_txt) {
    $btn_txt_name .= $btn_txt;

  }
  foreach ($txt_sample as $txt_variable) {
    $txt_sample_variable .= '"' . $txt_variable . '"' . ',';

  }
  $txt_variable = rtrim($txt_sample_variable, ",");
  foreach ($button_quickreply_text as $txt_button_qr_txt) {
    $txt_button_qr_text1 .= '"' . $txt_button_qr_txt . '"' . ',';
  }
  $txt_button_qr_text = explode(",", $txt_button_qr_text1);
  $txt_button_qr_text_1 = $txt_button_qr_text[0];
  $txt_button_qr_text_2 = $txt_button_qr_text[1];
  $txt_button_qr_text_3 = $txt_button_qr_text[2];
  $reply_arr = array();
  if ($txt_button_qr_text_1) {
    $reply_array .= '
  {"type":"QUICK_REPLY","text":' . $txt_button_qr_text_1 . '}';
    array_push($reply_arr, $reply_array);

  }
  if ($txt_button_qr_text_2) {
    $reply_array .= ',
  {"type":"QUICK_REPLY", "text":' . $txt_button_qr_text_2 . '}';
    array_push($reply_arr, $reply_array);
  }
  if ($txt_button_qr_text_3) {
    $reply_array .= ',
  {"type":"QUICK_REPLY", "text": ' . $txt_button_qr_text_3 . '}';
    array_push($reply_arr, $reply_array);
  }
  foreach ($reply_arr as $reply_arr1) {
    $reply_array_content = $reply_arr1;
  }

  // select option to get the value
  $selectOption = $_POST['header'];
  $select_action = $_POST['select_action'];
  $select_action1 = $_POST['select_action1'];
  $select_action2 = $_POST['select_action2'];
  $select_action3 = $_POST['select_action3'];
  $select_action4 = $_POST['select_action4'];
  $select_action5 = $_POST['select_action5'];
  $country_code = $_POST['country_code'];
  // define the value
  $whtsap_send = '';
  $add_url_btn = '';
  $add_phoneno_btn = '';

  // Remove unwanted spaces
  $textarea = trim($textarea);

  if ($textarea && $txt_variable) { // TextArea with Body Variable

    $whtsap_send .= '[
    {
      "type":"BODY", 
      "text":"' . $textarea . '",
      "example":{"body_text":[[' . $txt_variable . ']]}
  }';
  }
  if ($textarea && !$txt_variable) { // Only Textarea
    $whtsap_send .= '[ { 
                          "type": "BODY",
                          "text": "' . $textarea . '"
                        }';

  }
  if ($selectOption == 'TEXT') { // Text using Header Text
    switch ($selectOption == 'TEXT') {

      case $txt_header_name && !$txt_header_variable:
        $code .= "h";
        $whtsap_send .= ', 
        {
            "type":"HEADER", 
            "format":"TEXT",
            "text":"' . $txt_header_name . '"
        }';
        break;
      case $txt_header_name && $txt_header_variable: // Using Header Variable
        $code .= "h";
        $whtsap_send .= ', 
        {
            "type":"HEADER", 
            "format":"TEXT",
            "text":"' . $txt_header_name . '",
            "example":{"header_text":["' . $txt_header_variable . '"]}
        }';
        break;
      default:
        # code...
        break;
    }
  } else {

    $code .= "0";
  }

  if ($selectOption == 'MEDIA') { // Media
    switch ($media_category) {
      case 'image':
        $code .= "i00";
        break;
      case 'video':
        $code .= "0v0";
        break;
      case 'document':
        $code .= "00d";
        break;
      default:
        # code...
        break;
    }
  } else {
    $code .= "000";
  }
  // VISIT_URL
  if ($select_action5 == "VISIT_URL" && $btn_txt_url_name && $web_url_link) {
    $add_url_btn .= ',
                                      {
                                              "type":"URL", "text": "' . $btn_txt_url_name . '","url":"' . $web_url_link . '"
                                      }';

  } // PHONE_NUMBER
  if ($select_action4 == "PHONE_NUMBER" && $btn_txt_name && $btn_txt_phn_no && $country_code) {
    $add_phoneno_btn .= ',
                                        {"type":"PHONE_NUMBER","text":"' . $btn_txt_name . '","phone_number":"' . $country_code . '' . $btn_txt_phn_no . '" }';

  }
  // PHONE_NUMBER with add anothor button 
  if ($select_action1 == "PHONE_NUMBER" && $btn_txt_name && $btn_txt_phn_no && $country_code && $add_url_btn) {

    $code .= "cu"; // PHONE_NUMBER
  } else if ($select_action1 == "PHONE_NUMBER" && $btn_txt_name && $btn_txt_phn_no && $country_code) {
    $code .= "c0"; // VISIT_URL
  } else if ($select_action1 == "VISIT_URL" && $btn_txt_url_name && $web_url_link && $add_phoneno_btn) {
    $code .= "cu";
  } // VISIT_URL
  else if ($select_action1 == "VISIT_URL" && $btn_txt_url_name && $web_url_link) {
    $code .= "0u";
  } else {

    $code .= "00";
  } // quickreply
  if ($select_action == "QUICK_REPLY") {
    if ($txt_button_qr_text_1) {
      $code .= "r";
    }
  } else {

    $code .= "0";
  }
  if ($txt_footer_name) { // footer
    $code .= "f";
    $whtsap_send .= ', 							
                      {
                        "type":"FOOTER", 
                        "text":"' . $txt_footer_name . '"
                    }';

  } else {

    $code .= "0";
  } // PHONE_NUMBER and add url button
  if ($select_action1 == "PHONE_NUMBER" && $btn_txt_name && $btn_txt_phn_no && $country_code && $add_url_btn) {

    $whtsap_send .= ',
                                    {
                                      "type":"BUTTONS",
                                      "buttons":[{"type":"PHONE_NUMBER","text":"' . $btn_txt_name . '","phone_number":"' . $country_code . '' . $btn_txt_phn_no . '"} ' . $add_url_btn . ' ]
                                  
                                   }';
    // PHONE_NUMBER 
  } else if ($select_action1 == "PHONE_NUMBER" && $btn_txt_name && $btn_txt_phn_no && $country_code) {

    $whtsap_send .= ',
                                      {
                                        "type":"BUTTONS",
                                        "buttons":[{"type":"PHONE_NUMBER","text":"' . $btn_txt_name . '","phone_number":"' . $country_code . '' . $btn_txt_phn_no . '"}]
                                    
                                      }';
  }
  // VISIT_URL and add phone number button
  if ($select_action1 == "VISIT_URL" && $btn_txt_url_name && $web_url_link && $add_phoneno_btn) {

    $whtsap_send .= ',
                                    {
                                      "type":"BUTTONS",
                                          "buttons":[{"type":"URL", "text": "' . $btn_txt_url_name . '","url":"' . $web_url_link . '"}
                                          ' . $add_phoneno_btn . '	]	
                                          }';
    // VISIT_URL button
  } else if ($select_action1 == "VISIT_URL" && $btn_txt_url_name && $web_url_link) {

    $whtsap_send .= ',
                                            {
                                              "type":"BUTTONS",
                                                  "buttons":[{"type":"URL", "text": "' . $btn_txt_url_name . '","url":"' . $web_url_link . '"}
                                                    ]
                                                    }';
  } // QUICK_REPLY button
  if ($select_action == "QUICK_REPLY") {
    if ($txt_button_qr_text_1) {
      $whtsap_send .= ',
                                      {
                                        "type":"BUTTONS",
                      "buttons":[' . $reply_array_content . ']
                                      }';


    }
  }

  $whtsap_send .= '
                                    ]';

  // MEDIA select option
  if ($selectOption == 'MEDIA') {
    switch ($media_category) {
      case 'image':  // Image
        if (isset($_FILES['file_image_header']['name'])) {
          /* Location */
          $image_size = $_FILES['file_image_header']['size'];
          $image_type = $_FILES['file_image_header']['type'];
          $file_type = explode("/", $image_type);

          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
          $location = $full_pathurl . "uploads/whatsapp_images/" . $filename;
          $location_1 = $site_url . "uploads/whatsapp_images/" . $filename;
          $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
          $imageFileType = strtolower($imageFileType);
          //$location = $site_url . "uploads/whatsapp_images/" . $filename;
          /* Valid extensions */
          $valid_extensions = array("png", "jpg", "jpeg");

          $rspns = '';
          /* Check file extension */
          // if (in_array(strtolower($imageFileType), $valid_extensions)) {
          /* Upload file */
          if (move_uploaded_file($_FILES['file_image_header']['tmp_name'], $location)) {
            $rspns = $location;
            site_log_generate("Create Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_images file moved into Folder on " . date("Y-m-d H:i:s"), '../');
          }
        }
        // add bearer token
        $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
        // It will call "template_get_url" API to verify, can we access for the template_get_url
        $curl = curl_init();
        curl_setopt_array(
          $curl,
          array(
            CURLOPT_URL => $template_get_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{
      "language" : "' . $language_code . '",
      "category" : "' . $categories . '",
 "code" : "' . $code . '",
      "components" : ' . $whtsap_send . ',
      "mediatype" : "IMAGE",
 "request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
    }',
            CURLOPT_HTTPHEADER => array(
              $bearer_token,
              'Content-Type: application/json'

            ),
          )
        );

        $log_1 = '{
			"language" : "' . $language_code . '",
			"category" : "' . $categories . '",
 "code" : "' . $code . '",
			"components" : ' . $whtsap_send . ',
      "mediatype" : "IMAGE",
  "request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
	}';
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the log ($log_1) on " . date("Y-m-d H:i:s"), '../');
        // Send the data into API and execute 
        $response = curl_exec($curl);
        curl_close($curl);
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the response ($response) on " . date("Y-m-d H:i:s"), '../');
        // After got response decode the JSON result
        $obj = json_decode($response);
        if ($obj->response_status == 200) { //success
          $json = array("status" => 1, "msg" => $obj->response_msg);
        } else {
          if ($obj->response_status == 403 || $response == '') { ?>
            <script>
              window.location = "index"
            </script>
          <? }
          $json = array("status" => 0, "msg" => $obj->response_msg);
        }

        break;
      case 'document':   // Document
        if (isset($_FILES['file_image_header']['name'])) {

          $image_size = $_FILES['file_image_header']['size'];
          $image_type = $_FILES['file_image_header']['type'];
          $file_type = explode("/", $image_type);

          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];
          $location = $full_pathurl . "uploads/whatsapp_docs/" . $filename;
          $location_1 = $site_url . "uploads/whatsapp_docs/" . $filename;
          $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
          $imageFileType = strtolower($imageFileType);
          //$location = $site_url . "uploads/whatsapp_docs/" . $filename;
          /* Valid extensions */
          $valid_extensions = array("pdf");

          $rspns = '';
          /* Check file extension */
          if (in_array(strtolower($imageFileType), $valid_extensions)) {
            /* Upload file */
            if (move_uploaded_file($_FILES['file_image_header']['tmp_name'], $location)) {
              $rspns = $location;
              site_log_generate("Create Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_docs file moved into Folder on " . date("Y-m-d H:i:s"), '../');
            }
          }
        }
        // Add bearertoken
        $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
        // It will call "template_get_url" API to verify, can we access for the template_get_url
        $curl = curl_init();
        curl_setopt_array(
          $curl,
          array(
            CURLOPT_URL => $template_get_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{
"language" : "' . $language_code . '",
"category" : "' . $categories . '",
"code" : "' . $code . '",
"components" : ' . $whtsap_send . ',
"mediatype" : "DOCUMNET",
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
}',
            CURLOPT_HTTPHEADER => array(
              $bearer_token,
              'Content-Type: application/json'
            ),
          )
        );

        $log_2 = '{
			"language" : "' . $language_code . '",
			"category" : "' . $categories . '",
 "code" : "' . $code . '",
			"components" : ' . $whtsap_send . ',
      "mediatype" : "DOCUMNET",
      "request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
	}';
        // Send the data into API and execute 
        $response = curl_exec($curl);
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the log ($log_2) on " . date("Y-m-d H:i:s"), '../');
        // After got response decode the JSON result
        curl_close($curl);
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the response ($response) on " . date("Y-m-d H:i:s"), '../');
        $obj = json_decode($response);
        if ($obj->response_status == 200) { //success
          $json = array("status" => 1, "msg" => $obj->response_msg);
        } else {
          if ($obj->response_status == 403 || $response == '') { ?>
            <script>
              window.location = "index"
            </script>
          <? }
          $json = array("status" => 0, "msg" => $obj->response_msg);
        }

        break;
      case 'video': // video
        if (isset($_FILES['file_image_header']['name'])) {

          $image_size = $_FILES['file_image_header']['size'];
          $image_type = $_FILES['file_image_header']['type'];
          $file_type = explode("/", $image_type);
          $filename = $_SESSION['yjwatsp_user_id'] . "_" . $milliseconds . "." . $file_type[1];

          /* Location */
          $location = $full_pathurl . "uploads/whatsapp_videos/" . $filename;
          $location_1 = $site_url . "uploads/whatsapp_videos/" . $filename;

          $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
          $imageFileType = strtolower($imageFileType);
          $image_size = $_FILES['file_image_header']['size'];
          $image_type = $_FILES['file_image_header']['type'];
          //$location = $site_url . "uploads/whatsapp_videos/" . $filename;
          /* Valid extensions */
          $valid_extensions = array("mp4");

          $rspns = '';
          /* Check file extension */
          if (in_array(strtolower($imageFileType), $valid_extensions)) {
            /* Upload file */
            if (move_uploaded_file($_FILES['file_image_header']['tmp_name'], $location)) {
              $rspns = $location;
              site_log_generate("Create Template Page : User : " . $_SESSION['yjwatsp_user_name'] . " whatsapp_videos file moved into Folder on " . date("Y-m-d H:i:s"), '../');
            }
          }
        }
        // Add Bearertoken
        $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
        // It will call "template_get_url" API to verify, can we access for the template_get_url
        $curl = curl_init();
        curl_setopt_array(
          $curl,
          array(
            CURLOPT_URL => $template_get_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{
"language" : "' . $language_code . '",
"category" : "' . $categories . '",
"code" : "' . $code . '",
"components" : ' . $whtsap_send . ',
"mediatype" : "VIDEO",
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
}',
            CURLOPT_HTTPHEADER => array(
              $bearer_token,
              'Content-Type: application/json'

            ),
          )
        );

        $log_3 = '{
			"language" : "' . $language_code . '",
			"category" : "' . $categories . '",
 "code" : "' . $code . '",
			"components" : ' . $whtsap_send . ',
      "mediatype" : "VIDEO",
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
	}';  // Send the data into API and execute 
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the log ($log_3) on " . date("Y-m-d H:i:s"), '../');
        $response = curl_exec($curl);
        curl_close($curl);
        site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the response ($response) on " . date("Y-m-d H:i:s"), '../');
        // After got response decode the JSON result
        $obj = json_decode($response);
        if ($obj->response_status == 200) { //success
          $json = array("status" => 1, "msg" => $obj->response_msg);
        } else {
          if ($obj->response_status == 403 || $response == '') { ?>
            <script>
              window.location = "index"
            </script>
          <? }
          $json = array("status" => 0, "msg" => $obj->response_msg);
        }
        break;
      default:
        # code...
        break;
    }
  } else {
    // Add Bearer token
    $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
    // It will call "messenger_view_response" API to verify, can we access for the messenger view response
    $curl = curl_init();
    curl_setopt_array(
      $curl,
      array(
        CURLOPT_URL => $template_get_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => '{
"language" : "' . $language_code . '",
"code" : "' . $code . '",
"category" : "' . $categories . '",
"components" : ' . $whtsap_send . ',
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
}',
        CURLOPT_HTTPHEADER => array(
          $bearer_token,
          'Content-Type: application/json'

        ),
      )
    );

    $log_4 = '{
"language" : "' . $language_code . '",
 "code" : "' . $code . '",
"category" : "' . $categories . '",
"components" : ' . $whtsap_send . ',
"request_id" : "' . $_SESSION["yjwatsp_user_short_name"] . "_" . $year . $julian_dates . $hour_minutes_seconds . "_" . $random_generate_three . '"
}'; // Send the data into API and execute 
    site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the log ($log_4) on " . date("Y-m-d H:i:s"), '../');
    $response = curl_exec($curl);
    curl_close($curl);
    site_log_generate("Create Template Page : " . $_SESSION['yjwatsp_user_name'] . " executed the response ($response) on " . date("Y-m-d H:i:s"), '../');
    // After got response decode the JSON result
    $obj = json_decode($response);
    if ($obj->response_status == 200) { //success
      $json = array("status" => 1, "msg" => $obj->response_msg);
    } else {
      if ($obj->response_status == 403 || $response == '') { ?>
        <script>
          window.location = "index"
        </script>
      <? }
      $json = array("status" => 0, "msg" => $obj->response_msg);
    }
  }

}
// Create Template create_template - End

//chatbot flow - start
if ($_SERVER['REQUEST_METHOD'] == "POST" and $call_function == "chat_bot") {

  $start_name = htmlspecialchars(strip_tags(isset($_REQUEST['start_name']) ? $conn->real_escape_string($_REQUEST['start_name']) : ""));
  $restart_name = htmlspecialchars(strip_tags(isset($_REQUEST['restart_name']) ? $conn->real_escape_string($_REQUEST['restart_name']) : ""));
  $invalid_name = htmlspecialchars(strip_tags(isset($_REQUEST['invalid_name']) ? $conn->real_escape_string($_REQUEST['invalid_name']) : ""));

  $button_txt_st = htmlspecialchars(strip_tags(isset($_REQUEST['button_txt_st']) ? $conn->real_escape_string($_REQUEST['button_txt_st']) : ""));
  $txtarea_msg_st = htmlspecialchars(strip_tags(isset($_REQUEST['txtarea_msg']) ? $conn->real_escape_string($_REQUEST['txtarea_msg']) : ""));
  $txtarea_reply_st = htmlspecialchars(strip_tags(isset($_REQUEST['txtarea_reply']) ? $conn->real_escape_string($_REQUEST['txtarea_reply']) : ""));
  $txtarea_list_st = htmlspecialchars(strip_tags(isset($_REQUEST['txtarea_list_st']) ? $conn->real_escape_string($_REQUEST['txtarea_list_st']) : ""));

  $reply_array = array();
  $reply_array_add = array();
  // $list_array = array();

  foreach ($bot_array as $bot_array1) {
    $bot_array_list .= '"' . $bot_array1 . '"';
  }

  $chatbot_array = explode(',', $bot_array);

  // print_r($myArray[0]);

  foreach ($textarea_reply as $text_area_rpy) {
    $text_area_reply .= '"' . $text_area_rpy . '"';

  }
  foreach ($textarea_list as $text_area_lt) {
    $text_area_list .= '"' . $text_area_lt . '"';

  }

  foreach ($list_button as $list_btn) {
    $list_btn_txt .= '"' . $list_btn . '"';

  }

  foreach ($button_txt as $button_text) {
    $button_text_list .= '"' . $button_text . '"';

  }

  $reply_trim_adding = '';



  // Looping the i is less than the reply_button_st.if the condition is true to continue the process.if the condition are false to stop the process
  for ($i = 0; $i < count($reply_button_st); $i++) {
    $reply .= '{
      "type": "reply",
      "reply": {
          "id": "' . $reply_button_st[$i] . '",
          "title": "' . $reply_button_st[$i] . '"
      }
     },';
    // echo $reply;
  }

  $reply_trim = trim($reply, ",");

  if ($list_button_st) {
    for ($i = 0; $i < count($list_button_st); $i++) {
      // Looping the i is less than the list_button_st.if the condition is true to continue the process.if the condition are false to stop the process
      $list .= '{
      "id": "' . $list_button_st[$i] . '",
      "title": "' . $list_button_st[$i] . '"
  },';


    }
  }
  $list_trim = trim($list, ",");


  $textarea = str_replace("'", "\'", $textarea);
  $textarea = str_replace('"', '\"', $textarea);

  $chat_bot = array();


  $chat_bot_send = '';
  $chat_bot_send .= '[
		';

  if ($txtarea_msg_st || $txtarea_reply_st || $txtarea_list_st) {

    switch ($txtarea_msg_st || $txtarea_reply_st || $txtarea_list_st) {
      case $txtarea_msg_st:
        $chat_bot_send .= ' { 
        "id": "1",
        "parent": [
               "0"
       ],
       "pattern": "/' . $start_name . '/",
       "type": ["text"],
       "message": [
         {
                 "type": "text",
                 "text": {
                         "body": "' . $txtarea_msg_st . '"
                 }
         }
        ],
       "restart": [
        {
            "type": "text",
            "text": {
                "body": "' . $restart_name . '"
            }
        }
    ],
    "invalid": [
        {
            "type": "text",
            "text": {
                "body": "' . $invalid_name . '"
            }
        }
    ]
    },';
        break;
      case $txtarea_reply_st:
        $chat_bot_send .= ' { 
          "id": "1",
          "parent": [
                 "0"
         ],
         "pattern": "/' . $start_name . '/",
         "type":["text"],
         "message": [
          {
              "type": "interactive",
              "interactive": {
                  "type": "button",
                  "body": {
                      "text": "' . $txtarea_reply_st . '"
                  },
                  "action": {
                      "buttons":[' . $reply_trim . '] 
          }
        }
      }
       ],
      "restart": [
        {
            "type": "text",
            "text": {
                "body": "' . $restart_name . '"
            }
        }
    ],
    "invalid": [
        {
            "type": "text",
            "text": {
                "body": "' . $invalid_name . '"
            }
        }
    ]
},';
        break;
      case $txtarea_list_st:
        $chat_bot_send .= ' { 
            "id": "1",
            "parent": [
                   "0"
           ],
           "pattern": "/' . $start_name . '/",
           "type": ["text"],
           "message": [
            {
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "body": {
                        "text":  "' . $txtarea_list_st . '"
                    },
                    "action": {
                        "button":  "' . $button_txt_st . '",
                        "sections": [
                            {
                                "rows": [' . $list_trim . ']
                            }
                        ]
                    }
                }
            }
        ],
        "restart": [
          {
              "type": "text",
              "text": {
                  "body": "' . $restart_name . '"
              }
          }
      ],
      "invalid": [
          {
              "type": "text",
              "text": {
                  "body": "' . $invalid_name . '"
              }
          }
      ]
  }, ';
        break;

    }
  }

  if ($chatbot_array != '') {
    for ($i = 0; $i < count($chatbot_array); $i++) {
      // Looping the i is less than the chatbot_array.if the condition is true to continue the process.if the condition are false to stop the process
      switch ($chatbot_array != '') {
        case($chatbot_array[$i] == 'Replybutton_1' || $chatbot_array[$i] == 'Replybutton_2' || $chatbot_array[$i] == 'Replybutton_3'):
          $myArray = explode('_', $chatbot_array[$i]);

          // print_r($myArray);
          $reply_trim_adding = '';
          $reply = '';

          $chat_bot_send .= ' { 
        "id": "' . ($i + 2) . '",
        "parent": [
          "' . ($i + 1) . '"
       ],   
       "pattern": "/' . $_POST['' . "reply_pattern_" . ($i + 1) . ''] . '/",
       "type":["text"],
       "message": [
        {
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": { 
                    "text": "' . $_POST['' . "textarea_reply" . ($i + 1) . ''] . '"
                },
                "action": {
                  ';

          for ($j = 0; $j < $myArray[1]; $j++) {
            // Looping the j is less than the myArray.if the condition is true to continue the process.if the condition are false to stop the process
            $reply .= '{
             "type": "reply",
             "reply": {
                 "id": "' . $_POST['' . ($i + 1) . "_reply_button_" . ($j + 1) . ''] . '",
                 "title":"' . $_POST['' . ($i + 1) . "_reply_button_" . ($j + 1) . ''] . '"
             }
            },';
          }
          ;
          $reply_trim_adding = trim($reply, ",");
          $chat_bot_send .= '"buttons":[' . $reply_trim_adding . '
            ] 
        }
      }
    }
     ]
  },';

          break;
        case($chatbot_array[$i] == 'List_1' || $chatbot_array[$i] == 'List_2' || $chatbot_array[$i] == 'List_3' || $chatbot_array[$i] == 'List_4' || $chatbot_array[$i] == 'List_5' || $chatbot_array[$i] == 'List_6' || $chatbot_array[$i] == 'List_7' || $chatbot_array[$i] == 'List_8' || $chatbot_array[$i] == 'List_9' || $chatbot_array[$i] == 'List_10'):

          $myArray = explode('_', $chatbot_array[$i]);
          // print_r($myArray);
          $reply_trim_adding = '';
          $reply = '';
          $chat_bot_send .= ' { 
          "id": "' . ($i + 2) . '",
          "parent": [
            "' . ($i + 1) . '"
         ],
         "pattern": "/' . $_POST['' . "list_pattern_" . ($i + 1) . ''] . '/",
         "type": ["text"],
         "message": [
          {
              "type": "interactive",
              "interactive": {
                  "type": "list",
                  "body": {
                      "text":  "' . $_POST['' . "textarea_list_" . ($i + 1) . ''] . '"
                  },
                  "action": {
                    "button": "' . $_POST['' . "button_txt_" . ($i + 1) . ''] . '",
                    ';
          for ($j = 0; $j < $myArray[1]; $j++) {
            // Looping the j is less than the myArray.if the condition is true to continue the process.if the condition are false to stop the process
            $reply .= '{
               "type": "reply",
               "reply": {
                   "id": "' . $_POST['' . ($i + 1) . "_list_button_" . ($j + 1) . ''] . '",
                   "title":"' . $_POST['' . ($i + 1) . "_list_button_" . ($j + 1) . ''] . '"
               }
              },';
          }
          ;
          $reply_trim_adding = trim($reply, ",");
          $chat_bot_send .= '"sections":[{
                "rows": [
                ' . $reply_trim_adding . '
                ]
              }] 
          }
          }
              
          }
      ]
        },';
          break;
        case($chatbot_array[$i] == 'Message'):

          $chat_bot_send .= ' { 
            "id": "' . ($i + 2) . '",
            "parent": [
                   "' . ($i + 1) . '"
           ],
           "pattern": "/' . $_POST['' . "message_name_" . ($i + 1) . ''] . '/",
           "type": ["text"],
           "message": [
             {
                     "type": "text",
                     "text": {
                             "body": "' . $_POST['' . "textarea_msg_" . ($i + 1) . ''] . '"
                     }
             }
            ]
            },';
          // }
          break;
      }
    }

  }
  $chat_bot_send_trim = trim($chat_bot_send, ",");

  $chat_bot_send_trim .= ']';

  // To Send the request  API
  $replace_txt = '{
  "user_id" : "' . $_SESSION['yjwatsp_user_id'] . '",
  "whatsapp_config_id" : "' . $whatsapp_config_id . '",
  "flow_json" : "' . $flow_json . '",
  "flow_msg" : "' . $flow_msg . '"
}';
  //add bearer token
  $bearer_token = 'Authorization: ' . $_SESSION['yjwatsp_bearer_token'] . '';
  // It will call "chat_bot" API to verify, can we access for the chat_bot
  $curl = curl_init();
  curl_setopt_array(
    $curl,
    array(
      CURLOPT_URL => $api_url . '/chatbot/chat_bot',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $replace_txt,
      CURLOPT_HTTPHEADER => array(
        $bearer_token,
        'Content-Type: application/json'

      ),
    )
  );
  // Send the data into API and execute 
  site_log_generate("Chat bot Page : " . $_SESSION['yjwatsp_user_name'] . " logged in send it to Service [$replace_txt] on " . date("Y-m-d H:i:s"), '../');
  $response = curl_exec($curl);
  curl_close($curl);
  // After got response decode the JSON result
  $sql = json_decode($response, false);
  site_log_generate("Chat bot Page : Username => " . $_SESSION['yjwatsp_user_name'] . " executed the query reponse [$response] on " . date("Y-m-d H:i:s"), '../');
  if ($sql->response_code == 200) {
    site_log_generate("Chat bot Page : " . $_SESSION['yjwatsp_user_name'] . " new mobile no added successfully on " . date("Y-m-d H:i:s"), '../');
    $json = array("status" => 1, "msg" => "Chatbot Created Successfully!!");
  } else if ($sql->response_status == 403 || $response == '') { ?>
      <script>
        window.location = "index"
      </script>
  <? }
  echo $chat_bot_send_trim;
  $json = array("status" => 1, "msg" => "success");
}
//chatbot flow - End

// Finally Close all Opened Mysql DB Connection
$conn->close();

// Output header with JSON Response
header('Content-type: application/json');
echo json_encode($json);
