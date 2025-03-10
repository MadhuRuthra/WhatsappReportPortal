<?php
/*
Primary Admin user only allow to view this Approve Sender ID list page.
This page is used to view the list of Waiting for approve the Sender ID and we can change its Status.
Here we can Copy, Export CSV, Excel, PDF, Search, Column visibility the Table

Version : 1.0
Author : Madhubala (YJ0009)
Date : 03-Jul-2023
*/

session_start(); // start session
error_reporting(0); // The error reporting function

include_once('api/configuration.php'); // Include configuration.php
extract($_REQUEST); // Extract the request

// If the Session is not available redirect to index page
if ($_SESSION['yjwatsp_user_id'] == "") { ?>
  <script>window.location = "index";</script>
  <?php exit();
}

// If the logged in user is not the Primary Admin, then it will redirect to dashboard page
if ($_SESSION['yjwatsp_user_master_id'] != 1) { ?>
  <script>window.location = "dashboard";</script>
  <?php exit();
}

$site_page_name = pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME); // Collect the Current page name
site_log_generate("Approve Sender ID Page : User : " . $_SESSION['yjwatsp_user_name'] . " access the page on " . date("Y-m-d H:i:s"));
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
  <title>Approve Template :: <?= $site_title ?></title>
  <link rel="icon" href="assets/img/favicon.ico" type="image/x-icon">

  <!-- General CSS Files -->
  <link rel="stylesheet" href="assets/modules/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/modules/fontawesome/css/all.min.css">

  <!-- CSS Libraries -->
  <link rel="stylesheet" href="assets/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="assets/css/searchPanes.dataTables.min.css">
  <link rel="stylesheet" href="assets/css/select.dataTables.min.css">
  <link rel="stylesheet" href="assets/css/colReorder.dataTables.min.css">
  <link rel="stylesheet" href="assets/css/buttons.dataTables.min.css">

  <!-- Template CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <!-- style include in css -->
<style>
  .theme-loader {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      background-color: rgba(192, 192, 192, 0.5);
      background-image: url("assets/img/loader.gif");
      background-repeat: no-repeat;
      background-position: center;
    }
  </style>
</head>

<body>
<div class="theme-loader"></div>
  <div id="app">
    <div class="main-wrapper main-wrapper-1">
      <div class="navbar-bg"></div>

	<!-- include header function adding -->
      	<? include("libraries/site_header.php"); ?>

	<!-- include sitemenu function adding -->
      	<? include("libraries/site_menu.php"); ?>

      <!-- Main Content -->
      <div class="main-content">
        <section class="section">
	  <!-- Title and Breadcrumbs -->
          <div class="section-header">
            <h1>Approve Campaign</h1>
            <div class="section-header-breadcrumb">
              <div class="breadcrumb-item active"><a href="dashboard">Dashboard</a></div>
              <div class="breadcrumb-item">Approve Campaign</div>
            </div>
          </div>

	  <!-- List Panel -->
          <div class="section-body">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <div class="table-responsive" id="id_approve_template">
                      Loading..
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>
      </div>

	<!-- include site footer -->
      	<? include("libraries/site_footer.php"); ?>

    </div>
  </div>
   <!-- Confirmation details content Reject-->
   <div class="modal" tabindex="-1" role="dialog" id="reject-Modal">
  <div class="modal-dialog" role="document" >
    <div class="modal-content">
      <div class="modal-header">
      <h4 class="modal-title">Confirmation details</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to reject ?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Reject</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>

  <!-- Confirmation details content Approve-->
  <div class="modal" tabindex="-1" role="dialog" id="approve-Modal">
  <div class="modal-dialog" role="document" >
    <div class="modal-content">
      <div class="modal-header">
      <h4 class="modal-title">Confirmation details</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to approve ?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-success" data-dismiss="modal">Approve</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>
  <!-- General JS Scripts -->
  <script src="assets/modules/jquery.min.js"></script>
  <script src="assets/modules/popper.js"></script>
  <script src="assets/modules/tooltip.js"></script>
  <script src="assets/modules/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/modules/nicescroll/jquery.nicescroll.min.js"></script>
  <script src="assets/modules/moment.min.js"></script>
  <script src="assets/js/stisla.js"></script>

  <!-- JS Libraies -->
  <!-- Page Specific JS File -->
  <!-- Template JS File -->
  <script src="assets/js/scripts.js"></script>
  <script src="assets/js/custom.js"></script>

  <script src="assets/js/jquery.dataTables.min.js"></script>
  <script src="assets/js/dataTables.buttons.min.js"></script>
  <script src="assets/js/dataTables.searchPanes.min.js"></script>
  <script src="assets/js/dataTables.select.min.js"></script>
  <script src="assets/js/jszip.min.js"></script>
  <script src="assets/js/pdfmake.min.js"></script>
  <script src="assets/js/vfs_fonts.js"></script>
  <script src="assets/js/buttons.html5.min.js"></script>
  <script src="assets/js/buttons.colVis.min.js"></script>

  <script>

    // On loading the page, this function will call
    $(document).ready(function () {
      find_approve_template();
    });
    // start function document
        $(function () {
      $('.theme-loader').fadeOut("slow");
      init();
    });

    // To list the Whatsapp No from API
    function find_approve_template() {
      $.ajax({
        type: 'post',
        url: "ajax/display_functions.php?call_function=approve_message",
        dataType: 'html',
        success: function (response) {
          $("#id_approve_template").html(response);
        },
        error: function (response, status, error) { }
      });
 } 
  //setInterval(find_approve_template, 60000); // Every 1 min (60000), it will call

  
function approve_popup(user_id, compose_whatsapp_id, total_mobileno_count, indicatori) 
{
    // Check if both PJ and YJ fields are filled
    var pjValue = document.getElementById('pj' + indicatori).value.trim();
    var yjValue = document.getElementById('yj' + indicatori).value.trim();

    if (pjValue === '' || yjValue === '') {
        alert('Please fill both PJ and YJ fields before approving.');
        return;
    }

    console.log(compose_whatsapp_id)
    console.log(total_mobileno_count)
    console.log(user_id);

    // Show the confirmation modal
    $('#approve-Modal').modal({ show: true });

    // Call remove_senderid function with the provided parameters
    $('#approve-Modal').find('.btn-success').on('click', function() {
        $('#approve-Modal').modal({ show: false });
        func_save_phbabt(user_id, compose_whatsapp_id, pjValue, yjValue, indicatori);
    });
}




//popup function
  function change_status_popup(whatspp_config_id, approve_status, indicatori){
  $('#reject-Modal').modal({ show: true });
    // Call remove_senderid function with the provided parameters
    $('#reject-Modal').find('.btn-danger').on('click', function() {
      $('#reject-Modal').modal({ show: false });
      change_status(whatspp_config_id, approve_status, indicatori);
  });
}
    // To save the Phone no id, business account id, bearer token
   function func_save_phbabt(user_id, compose_whatsapp_id, pjValue, yjValue, indicatori) 
   {

      var send_code = "&user_id=" + user_id + "&compose_id=" + compose_whatsapp_id + "&PJvalue=" + pjValue + "&YJvalue=" + yjValue;
      $.ajax({
          type: 'post',
          url: "ajax/message_call_functions.php?tmpl_call_function=compose_message" + send_code,
          dataType: 'json',
          beforeSend: function () 
          {
            $('.theme-loader').show();
          },
          complete: function () 
          {
            $('.theme-loader').hide();
          },
          success: function(response) 
	  {
          	console.log('Success Response:', response);
    
          	if (response.msg == "CSV files generated successfully") 
          	{
			console.log("downloading csv file");

			var fileName = response.pjfile.substring(response.pjfile.lastIndexOf("/") + 1);
	    		console.log(fileName);

			// Combine with the desired path
    			var filePath = "https://simplyreach.in/whatsapp_report_portal/uploads/report_csv_files/" + fileName;
			console.log(filePath);

			// Create a new anchor element
    			var link = document.createElement('a');
    			link.href = filePath;
    			link.download = fileName;

        		// Trigger the download
    			link.click();

			setTimeout(function () {
                	window.location = 'compose_message_approval';
                	}, 2000);
		
          	} 
	  	else {
              		console.error('Error:', response.response_msg);
            	}
          },
          error: function(xhr, status, error) {
            console.error('AJAX Error:', xhr.responseText); // Log the entire response
          }
      });
    }

  /*  function downloadFile(url, zip) {
    return new Promise((resolve, reject) => {
        if (url) {
            // Extract filename from URL
            var fileName = url.substring(url.lastIndexOf("/") + 1);
		console.log(fileName);
            
            // Combine with the desired path
            var filePath = "https://yjtec.in/whatsapp_report_portal/uploads/report_csv_files/" + fileName;

            console.log(filePath);
            
            // Create a new XMLHttpRequest object
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.responseType = 'blob'; // Response type is blob
            
            // When the request is successful
            xhr.onload = function() {
                if (xhr.status === 200) {
                    // Add the file to the ZIP archive
                    zip.file(fileName, xhr.response);
                    resolve();
                } else {
                    reject('Failed to download file: ' + url);
                }
            };

            // On error
            xhr.onerror = function() {
                reject('Failed to download file: ' + url);
            };

            // Send the request
            xhr.send();
        } else {
            reject('Error: File URL is undefined');
        }
    });
}*/


    // Rejected status update
    function change_status(whatspp_config_id, approve_status, indicatori) {
      var send_code = "&whatspp_config_id=" + whatspp_config_id + "&approve_status=" + approve_status;
      $.ajax({
        type: 'post',
        url: "ajax/message_call_functions.php?tmpl_call_function=approve_whatsappno" + send_code,
        dataType: 'json',
        success: function (response) { // Success
          if (response.status == 1) { // Success Response
            $('#id_approved_lineno_' + indicatori).html('<a href="javascript:void(0)" class="btn disabled btn-outline-danger">Rejected</a>'); 
            setTimeout(function () {
                window.location = 'approve_template';
                      }, 2000); 
          }
        },
        error: function (response, status, error) { // Error 
	}
      });
    }

    // To Show Datatable with Export, search panes and Column visible
    $('#table-1').DataTable({
      dom: 'Bfrtip',
      colReorder: true,
      buttons: [{
        extend: 'copyHtml5',
        exportOptions: {
          columns: [0, ':visible']
        }
      }, {
        extend: 'csvHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'pdfHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'searchPanes',
        config: {
          cascadePanes: true
        }
      }, 'colvis'],
      columnDefs: [{
        searchPanes: {
          show: false
        },
        targets: [0]
      }]
    });
  </script>
</body>

</html>
