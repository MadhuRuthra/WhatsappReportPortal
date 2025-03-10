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
  <title>Approve Template ::
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
            <h1>Approve Template</h1>
            <div class="section-header-breadcrumb">
              <div class="breadcrumb-item active"><a href="dashboard">Dashboard</a></div>
              <div class="breadcrumb-item">Approve Template</div>
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

    <!-- Modal Popup window content-->
    <div class="modal fade" id="default-Modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document" style=" max-width: 75% !important;">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Template Details</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="id_modal_display" style=" word-wrap: break-word; word-break: break-word;">
          <h5>No Data Available</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success waves-effect " data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>


  <!-- Confirmation details content Reject-->
  <div class="modal" tabindex="-1" role="dialog" id="reject-Modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Confirmation details</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="needs-validation" novalidate="" id="frm_sender_id" name="frm_sender_id" action="#" method="post"
            enctype="multipart/form-data">

            <div class="form-group mb-2 row">
              <label class="col-sm-3 col-form-label">Reason <label style="color:#FF0000">*</label></label>
              <div class="col-sm-9">
                <input class="form-control form-control-primary" type="text" name="reject_reason" id="reject_reason"
                  maxlength="50" title="Reason to Reject" tabindex="12" placeholder="Reason to Reject">
              </div>
            </div>
          </form>
          <p>Are you sure you want to reject ?</p>
        </div>
        <div class="modal-footer">
          <span class="error_display" id='id_error_reject'></span>
          <button type="button" class="btn btn-danger">Reject</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation details content Approve-->
  <div class="modal" tabindex="-1" role="dialog" id="approve-Modal">
    <div class="modal-dialog" role="document">
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
        url: "ajax/display_functions.php?call_function=approve_template",
        dataType: 'html',
        success: function (response) {
          $("#id_approve_template").html(response);
        },
        error: function (response, status, error) { }
      });
    }
    setInterval(find_approve_template, 60000); // Every 1 min (60000), it will call

    var unique_templateid, templatestatus, table_id;
    //popup function
    function approve_popup(unique_template_id, template_status, indicatori) {
      unique_templateid = unique_template_id, templatestatus = template_status, table_id = indicatori;
      $('#approve-Modal').modal({ show: true });
      // Call remove_senderid function with the provided parameters
    }

    $('#approve-Modal').find('.btn-success').on('click', function () {
      $('#approve-Modal').modal({ show: false });
      func_save_phbabt(unique_templateid, templatestatus, table_id);
    });


    // To save the Phone no id, business account id, bearer token
    function func_save_phbabt(unique_template_id, template_status, indicatori) {
      var send_code = "&unique_template_id=" + unique_template_id + "&template_status=" + template_status;
      $.ajax({
        type: 'post',
        url: "ajax/message_call_functions.php?tmpl_call_function=approve_template" + send_code,
        dataType: 'json',
        beforeSend: function () {
          $('.theme-loader').show();
        },
        complete: function () {
          $('.theme-loader').hide();
        },
        success: function (response) { // Success
          if (response.status = 0) {
            $('#id_approved_lineno_' + indicatori).html('<a href="javascript:void(0)" class="btn disabled btn-outline-success">' + response.msg + '</a>');
          } else { // Success
            $('#id_approved_lineno_' + indicatori).html('<a href="javascript:void(0)" class="btn disabled btn-outline-success">Success</a>');
            setTimeout(function () {
              window.location = 'approve_template';
            }, 3000); // Every 3 seconds it will check
            $('.theme-loader').hide();
          }
        },
        error: function (response, status, error) { // Error
        }
      });
    }

    var unique_templateid, approvestatus, table_id;
    //popup function
    function change_status_popup(unique_template_id, approve_status, indicatori) {
      unique_templateid = unique_template_id, approvestatus = approve_status, table_id = indicatori
      $('#reject-Modal').modal({ show: true });
    }

    $('#reject-Modal').on('hidden.bs.modal', function (e) {
      $("#id_error_reject").html("");
      $('#reject_reason').val('');
    });


    // Call remove_senderid function with the provided parameters
    $('#reject-Modal').find('.btn-danger').on('click', function () {
      var reason = $('#reject_reason').val();
      console.log(reason);
      if (reason == "") {
        $('#reject-Modal').modal({ show: true });
        $("#id_error_reject").html("Please enter reason to reject");
      }
      else {
        $('#reject-Modal').modal({ show: false });
        var send_code = "&unique_template_id=" + unique_templateid + "&template_status=" + approvestatus + "&reject_reason=" + reason;
        $.ajax({
          type: 'post',
          url: "ajax/message_call_functions.php?tmpl_call_function=approve_template" + send_code,
          dataType: 'json',
          success: function (response) { // Success
            if (response.status == 1) { // Success Response
              $('#reject-Modal').modal({ show: close });
              $('#id_approved_lineno_' + table_id).html('<a href="javascript:void(0)" class="btn disabled btn-outline-danger">Rejected</a>');
              setTimeout(function () {
                window.location = 'approve_template';
              }, 2000);
            }
          },
          error: function (response, status, error) { // Error 
          }
        });
      }
    });


    
       // To get the Single Template details from List and show in Modal Popup Window
       function call_getsingletemplate(tmpl_name, indicatori) {
        console.log(tmpl_name);
      var template_name = tmpl_name.split('!');
      $("#slt_whatsapp_template_single").html("");
      $.ajax({
        type: 'post',
        url: "ajax/whatsapp_call_functions.php?previewTemplate_meta=previewTemplate_meta&tmpl_name=" + tmpl_name,
        success: function (response_msg) { // Success
          console.log("!!!!!!");
          console.log(response_msg);
          if (response_msg.msg == '-') {
            $("#id_modal_display").html('Template Name : ' + template_name[0] + '<br>No Data Available!!');
          } else {
            $("#id_modal_display").html('Template Name : ' + template_name[0] + '<br>' + response_msg.msg);
          }
          $('#default-Modal').modal({ show: true });
        },
        error: function (response_msg, status, error) { // Error
          $("#id_modal_display").html(response_msg.msg);
          $('#default-Modal').modal({ show: true });
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
