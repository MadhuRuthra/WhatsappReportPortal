-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 29, 2024 at 04:50 AM
-- Server version: 8.0.34
-- PHP Version: 8.0.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `whatsapp_report_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_1`
--

CREATE TABLE `compose_whatsapp_1` (
  `compose_whatsapp_id` int NOT NULL,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `whatspp_config_id` int NOT NULL,
  `mobile_nos` longblob NOT NULL,
  `sender_mobile_nos` longblob NOT NULL,
  `whatsapp_content` varchar(1000) NOT NULL,
  `message_type` varchar(50) NOT NULL,
  `total_mobileno_count` int DEFAULT NULL,
  `content_char_count` int NOT NULL,
  `content_message_count` int NOT NULL,
  `campaign_name` varchar(30) DEFAULT NULL,
  `whatsapp_status` char(1) NOT NULL,
  `whatsapp_entry_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_status_1`
--

CREATE TABLE `compose_whatsapp_status_1` (
  `comwtap_status_id` int NOT NULL,
  `compose_whatsapp_id` int NOT NULL,
  `country_code` int DEFAULT NULL,
  `mobile_no` varchar(13) NOT NULL,
  `comments` varchar(100) NOT NULL,
  `comwtap_status` char(1) NOT NULL,
  `comwtap_entry_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `response_status` char(1) DEFAULT NULL,
  `response_message` varchar(100) DEFAULT NULL,
  `response_id` varchar(100) DEFAULT NULL,
  `response_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `delivery_status` char(1) DEFAULT NULL,
  `delivery_date` timestamp NULL DEFAULT NULL,
  `read_date` timestamp NULL DEFAULT NULL,
  `read_status` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_status_tmpl_1`
--

CREATE TABLE `compose_whatsapp_status_tmpl_1` (
  `comwtap_status_id` int NOT NULL,
  `compose_whatsapp_id` int NOT NULL,
  `country_code` int DEFAULT NULL,
  `mobile_no` varchar(13) NOT NULL,
  `report_group` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `comments` varchar(100) NOT NULL,
  `comwtap_status` char(1) NOT NULL,
  `comwtap_entry_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `response_status` char(1) DEFAULT NULL,
  `response_message` varchar(100) DEFAULT NULL,
  `response_id` varchar(100) DEFAULT NULL,
  `response_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `delivery_status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `delivery_date` timestamp NULL DEFAULT NULL,
  `read_date` timestamp NULL DEFAULT NULL,
  `read_status` char(1) DEFAULT NULL,
  `campaign_status` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `compose_whatsapp_status_tmpl_1`
--

INSERT INTO `compose_whatsapp_status_tmpl_1` (`comwtap_status_id`, `compose_whatsapp_id`, `country_code`, `mobile_no`, `report_group`, `comments`, `comwtap_status`, `comwtap_entry_date`, `response_status`, `response_message`, `response_id`, `response_date`, `delivery_status`, `delivery_date`, `read_date`, `read_status`, `campaign_status`) VALUES
(91224, 42, NULL, '919894606748', NULL, '-', 'N', '2024-03-19 07:21:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N'),
(91225, 43, NULL, '919090909090', NULL, '-', 'N', '2024-03-28 13:14:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N'),
(91226, 43, NULL, '919090909091', NULL, '-', 'N', '2024-03-28 13:14:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N'),
(91227, 43, NULL, '919090909092', NULL, '-', 'N', '2024-03-28 13:14:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N'),
(91228, 43, NULL, '919090909093', NULL, '-', 'N', '2024-03-28 13:14:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N'),
(91229, 43, NULL, '919090909094', NULL, '-', 'N', '2024-03-28 13:14:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_tmpl_1`
--

CREATE TABLE `compose_whatsapp_tmpl_1` (
  `compose_whatsapp_id` int NOT NULL,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `whatspp_config_id` int NOT NULL,
  `mobile_nos` longblob NOT NULL,
  `sender_mobile_nos` longblob NOT NULL,
  `variable_values` longblob,
  `media_values` longblob,
  `whatsapp_content` varchar(1000) NOT NULL,
  `message_type` varchar(50) NOT NULL,
  `total_mobileno_count` int DEFAULT NULL,
  `content_char_count` int NOT NULL,
  `content_message_count` int NOT NULL,
  `campaign_name` varchar(30) DEFAULT NULL,
  `campaign_id` varchar(10) DEFAULT NULL,
  `mobile_no_type` varchar(1) NOT NULL,
  `unique_template_id` varchar(30) NOT NULL,
  `template_id` varchar(10) DEFAULT NULL,
  `whatsapp_status` char(1) NOT NULL,
  `whatsapp_entry_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `media_url` varchar(100) DEFAULT NULL,
  `tg_base` varchar(50) DEFAULT NULL,
  `cg_base` varchar(50) DEFAULT NULL,
  `reject_reason` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `compose_whatsapp_tmpl_1`
--

INSERT INTO `compose_whatsapp_tmpl_1` (`compose_whatsapp_id`, `user_id`, `store_id`, `whatspp_config_id`, `mobile_nos`, `sender_mobile_nos`, `variable_values`, `media_values`, `whatsapp_content`, `message_type`, `total_mobileno_count`, `content_char_count`, `content_message_count`, `campaign_name`, `campaign_id`, `mobile_no_type`, `unique_template_id`, `template_id`, `whatsapp_status`, `whatsapp_entry_date`, `media_url`, `tg_base`, `cg_base`, `reject_reason`) VALUES
(42, 1, 1, 1, 0x393139383934363036373438, 0x2d, 0x5b5d, NULL, 'te_pri_t0i00000f_24318_016', 'TEXT', 1, 1, 1, 'ca_pri_079_1', 'KPNNMEHMWK', 'Y', 'tmplt_pri_079_016', NULL, 'R', '2024-03-19 07:21:53', 'https://simplyreach.in/whatsapp_report_portal/uploads/whatsapp_images/1_1710832913858.png', NULL, NULL, 'tesst'),
(43, 1, 1, 1, 0x3931393039303930393039302c3931393039303930393039312c3931393039303930393039322c3931393039303930393039332c393139303930393039303934, 0x2d, 0x5b5b2233225d2c5b2235225d2c5b2232225d2c5b2236225d2c5b2232225d5d, 0x5b5d, 'te_use_t000d000f_24327_026', 'TEXT', 5, 1, 5, 'ca_pri_088_43', 'N26J2V26JF', 'Y', 'tmplt_use_088_026', NULL, 'W', '2024-03-28 13:14:58', 'https://simplyreach.in/whatsapp_report_portal/uploads/whatsapp_docs/1_1711631698116.pdf', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_text_1`
--

CREATE TABLE `whatsapp_text_1` (
  `whatsapp_text_id` int NOT NULL,
  `compose_whatsapp_id` int NOT NULL,
  `sms_type` varchar(50) NOT NULL,
  `whatsapp_text_title` varchar(30) NOT NULL,
  `text_data` varchar(2000) DEFAULT NULL,
  `text_reply` varchar(50) DEFAULT NULL,
  `text_number` varchar(13) DEFAULT NULL,
  `text_address` varchar(100) DEFAULT NULL,
  `text_name` varchar(30) DEFAULT NULL,
  `text_url` varchar(100) DEFAULT NULL,
  `text_title` varchar(200) DEFAULT NULL,
  `text_description` varchar(200) DEFAULT NULL,
  `text_start_time` timestamp NULL DEFAULT NULL,
  `text_end_time` timestamp NULL DEFAULT NULL,
  `carousel_fileurl` varchar(100) DEFAULT NULL,
  `carousel_srno` int DEFAULT NULL,
  `whatsapp_text_status` char(1) NOT NULL,
  `whatsapp_text_entry_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_text_tmpl_1`
--

CREATE TABLE `whatsapp_text_tmpl_1` (
  `compose_whatsapp_msgid` int NOT NULL,
  `compose_whatsapp_id` int NOT NULL,
  `whatspp_template` varchar(600) NOT NULL,
  `whatsapp_tmpl_category` varchar(50) NOT NULL,
  `whatsapp_tmpl_name` varchar(500) NOT NULL,
  `whatsapp_tmpl_language` varchar(20) NOT NULL,
  `whatsapp_tmpl_hdtext` varchar(60) DEFAULT NULL,
  `whatsapp_tmpl_body` varchar(2000) NOT NULL,
  `whatsapp_tmpl_footer` varchar(60) DEFAULT NULL,
  `whatsapp_tmpl_status` char(1) NOT NULL,
  `whatsapp_tmpl_entrydate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `compose_whatsapp_1`
--
ALTER TABLE `compose_whatsapp_1`
  ADD PRIMARY KEY (`compose_whatsapp_id`),
  ADD KEY `user_id` (`user_id`,`store_id`,`whatspp_config_id`);

--
-- Indexes for table `compose_whatsapp_status_1`
--
ALTER TABLE `compose_whatsapp_status_1`
  ADD PRIMARY KEY (`comwtap_status_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- Indexes for table `compose_whatsapp_status_tmpl_1`
--
ALTER TABLE `compose_whatsapp_status_tmpl_1`
  ADD PRIMARY KEY (`comwtap_status_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`),
  ADD KEY `mobile_no` (`mobile_no`),
  ADD KEY `report_group` (`report_group`);

--
-- Indexes for table `compose_whatsapp_tmpl_1`
--
ALTER TABLE `compose_whatsapp_tmpl_1`
  ADD PRIMARY KEY (`compose_whatsapp_id`),
  ADD KEY `user_id` (`user_id`,`store_id`,`whatspp_config_id`);

--
-- Indexes for table `whatsapp_text_1`
--
ALTER TABLE `whatsapp_text_1`
  ADD PRIMARY KEY (`whatsapp_text_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- Indexes for table `whatsapp_text_tmpl_1`
--
ALTER TABLE `whatsapp_text_tmpl_1`
  ADD PRIMARY KEY (`compose_whatsapp_msgid`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compose_whatsapp_1`
--
ALTER TABLE `compose_whatsapp_1`
  MODIFY `compose_whatsapp_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compose_whatsapp_status_1`
--
ALTER TABLE `compose_whatsapp_status_1`
  MODIFY `comwtap_status_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compose_whatsapp_status_tmpl_1`
--
ALTER TABLE `compose_whatsapp_status_tmpl_1`
  MODIFY `comwtap_status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91230;

--
-- AUTO_INCREMENT for table `compose_whatsapp_tmpl_1`
--
ALTER TABLE `compose_whatsapp_tmpl_1`
  MODIFY `compose_whatsapp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `whatsapp_text_1`
--
ALTER TABLE `whatsapp_text_1`
  MODIFY `whatsapp_text_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_text_tmpl_1`
--
ALTER TABLE `whatsapp_text_tmpl_1`
  MODIFY `compose_whatsapp_msgid` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
