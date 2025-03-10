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
  <title>Manual Report Upload ::
    <?= $site_title ?>
  </title>
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

    .separator {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
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
            <h1>Manual Report Upload</h1>
            <div class="section-header-breadcrumb">
              <div class="breadcrumb-item active"><a href="dashboard">Dashboard</a></div>
              <div class="breadcrumb-item">Manual Report Upload</div>
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
  <div class="modal" tabindex="-1" role="dialog" id="Pending-Model">
    <div class="modal-dialog" role="document">
      <div class="modal-content" style="width:75%">
        <div class="modal-header">
          <h4 class="modal-title">Pending Mobile Numbers</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body container text-center">
          <hr class="separator">
          <div>918838964597</div>
          <div>918838964597</div>
          <div>918838964597</div>
          <div>918838964597</div>
          <div>918838964597</div>
          <!-- Add more divs as needed -->
          <hr class="separator">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>


  <!-- Confirmation details content Approve
  <div class="modal" tabindex="-1" role="dialog" id="approve-Modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">File Upload</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <input type="file" name="file_image_header" id="file_image_header" tabindex="10" accept=".csv"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-dismiss="modal">Upload</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>-->

  <!-- Confirmation details content Approve-->
 <div class="modal" tabindex="-1" role="dialog" id="approve-Modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <form id="fileForm" enctype="multipart/form-data">
        <div class="modal-header">
          <h4 class="modal-title">File Upload</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input type="file" name="file_image_header" id="file_image_header" tabindex="10" accept=".csv" />
          <input type="hidden" name="compose_whatsapp_id" id="compose_whatsapp_id" /> 
          <input type="hidden" name="report_group" id="report_group" /> 
	 <input type="hidden" name="user_id" id="user_id" />
	<div id="fileError" style="color: red;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" onclick="func_save_phbabt()">Upload</button> 
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </form>
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
   //setInterval(find_approve_template, 60000); // Every 1 min (60000), it will call
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
        url: "ajax/display_functions.php?call_function=manual_report",
        dataType: 'html',
        success: function (response) {
          $("#id_approve_template").html(response);
        },
        error: function (response, status, error) { }
      });
    }

    function approve_popup(compose_whatsapp_id, report_group, user_id) {
      $('#approve-Modal').modal('show'); // Simplified modal show method
      $('#compose_whatsapp_id').val(compose_whatsapp_id);
      $('#report_group').val(report_group);
	$('#user_id').val(user_id);
    }

    
    // To save the Phone no id, business account id, bearer token
    function func_save_phbabt() {

      var compose_whatsapp_id = document.getElementById('compose_whatsapp_id').value;
      var report_group = document.getElementById('report_group').value;
	var user_id = document.getElementById('user_id').value;
	console.log(user_id);

      var fileInput = document.getElementById('file_image_header');
      var file = fileInput.files[0];
      var formData = new FormData(document.getElementById("fileForm"));
      formData.append('file', file);
      formData.append('compose_whatsapp_id', compose_whatsapp_id);
      formData.append('report_group', report_group);
      formData.append('user_id', user_id);
      //alert(formData)

	
       
      if (!file) 
      {
           //alert("please upload a file");
           $('#fileError').text("Please upload a file.");
           return;
      }

       // Get the file extension
       var fileExtension = file.name.split('.').pop().toLowerCase();
       console.log(fileExtension);

      // Check if the file extension is CSV
      if (fileExtension !== 'csv') {
          //alert("Only CSV files are allowed.");
          $('#fileError').text("Only CSV files are allowed.");
          return;
      }


      //var send_code = "&file=" + file + "&compose_whatsapp_id=" + compose_whatsapp_id
      $.ajax({
        type: 'post',
        url: "ajax/message_call_functions.php?tmpl_call_function=manual_report",
        data: formData,
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Set content type to false
        // dataType: 'json',
        beforeSend: function () {
          $('.theme-loader').show();
        },
        complete: function () {
          $('.theme-loader').hide();
        },
          success: function (response) { // Success
          if (response.status == 0) {
            alert(response.msg);
            setTimeout(function () {
              window.location = 'manual_report_upload';
            }, 1000); 
          } else { // Success
            $('#approve-Modal').modal('hide');
            alert("File Uploaded successfully !!")
            setTimeout(function () {
              window.location = 'manual_report_upload';
            }, 1000); // Every 3 seconds it will check
            $('.theme-loader').hide();
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
