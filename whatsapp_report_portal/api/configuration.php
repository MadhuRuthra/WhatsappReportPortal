<?php
set_time_limit(0);

function encrypt($data, $key) {
    $method = 'aes-256-cbc';
    $iv = substr(hash('sha256', $key), 0, 16);
    return openssl_encrypt($data, $method, $key, 0, $iv);
}

function decrypt($data, $key) {
    $method = 'aes-256-cbc';
    $iv = substr(hash('sha256', $key), 0, 16);
    return openssl_decrypt($data, $method, $key, 0, $iv);
}

$encryption_key = 'my_secret_key'; // Replace with your own key

// Encrypt sensitive data
$servername = encrypt("localhost", $encryption_key);
$username = encrypt("root", $encryption_key);
$password = encrypt("", $encryption_key);
$dbname = encrypt("whatsapp_report", $encryption_key);

$whatsapp_bearer_token = encrypt('EAAlaTtm1XV0BANV3Lc8mA5kEO4BqWsCKudO6lNWGcVyl6O6wIK7mJqXCtPtpyjhO36ZA1eEGLra4Q21T7aEWns1VxqwcOFVR4BtQsxShdMB9zBIPjN4gaj3KTz5ZBHnEtO3WVkC26UdLpM75vIZBIZCw8eCRVus4NcZC7FZC3NhBFqpF3ntmGh13ZAZBdUcVtwJ9Mcout3A1ZCwZDZD', $encryption_key);
$rp_keyid = encrypt("rzp_live_pWIs8WdU8DslrS", $encryption_key);
$rp_keysecret = encrypt("YZ9n7AxPKNjAifkMZWr0XOOc", $encryption_key);

// Decrypt sensitive data
$servername = decrypt($servername, $encryption_key);
$username = decrypt($username, $encryption_key);
$password = decrypt($password, $encryption_key);
$dbname = decrypt($dbname, $encryption_key);

$whatsapp_bearer_token = decrypt($whatsapp_bearer_token, $encryption_key);
$rp_keyid = decrypt($rp_keyid, $encryption_key);
$rp_keysecret = decrypt($rp_keysecret, $encryption_key);

$site_title = "Whatsapp - V2 Report";
$site_url   = "http://localhost/whatsapp_report_portal/";
$api_url    = "http://localhost:10017";
$template_get_url = "http://localhost:10017/create_template";
$full_pathurl = "/opt/lampp/htdocs/whatsapp_report_portal/";

$monthly_allowed_qty    = 800;
$whatsapp_mobno         = "8610110464"; 
$whatsapp_wabaid        = "100175206060494"; 
$whatsapp_phone_id      = "103741605696935";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

mysqli_query($conn, "SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
date_default_timezone_set("Asia/Kolkata"); 

include_once('ajax/site_common_functions.php'); 

function site_log_generate($log_msg, $location = '')
{
    $max_size = 10485760; 

    $log_base_url = ( isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']=='on' ? 'https' : 'http' ) . '://' .  $_SERVER['HTTP_HOST'];
    $log_url = $log_base_url . $_SERVER["REQUEST_URI"]." : IP Address : ".$_SERVER['SERVER_ADDR']." ==> ";

    $log_filename = "site_log";
    if (!file_exists($location."log/".$log_filename)) 
    {
        mkdir($location."log/".$log_filename, 0777, true);
    }
    $log_file_data1 = $location."log/".$log_filename.'/log_'.date('d-M-Y');
    $log_file_data  = $log_file_data1.'.log';

    clearstatcache();
    $size = filesize($log_file_data);

    if($size > $max_size)
    {
        shell_exec("mv ".$log_file_data." ".$log_file_data1."-".date('YmdHis').".log");
    }

    file_put_contents($log_file_data, $log_url.$log_msg . "\n", FILE_APPEND);
}
?>
