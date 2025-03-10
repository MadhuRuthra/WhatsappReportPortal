-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 29, 2024 at 04:58 AM
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
-- Database: `whatsapp_report_4`
--

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_4`
--

CREATE TABLE `compose_whatsapp_4` (
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
-- Table structure for table `compose_whatsapp_status_4`
--

CREATE TABLE `compose_whatsapp_status_4` (
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
-- Table structure for table `compose_whatsapp_status_tmpl_4`
--

CREATE TABLE `compose_whatsapp_status_tmpl_4` (
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

-- --------------------------------------------------------

--
-- Table structure for table `compose_whatsapp_tmpl_4`
--

CREATE TABLE `compose_whatsapp_tmpl_4` (
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
  `media_url` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tg_base` varchar(50) DEFAULT NULL,
  `cg_base` varchar(50) DEFAULT NULL,
  `reject_reason` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_text_4`
--

CREATE TABLE `whatsapp_text_4` (
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
-- Table structure for table `whatsapp_text_tmpl_4`
--

CREATE TABLE `whatsapp_text_tmpl_4` (
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
-- Indexes for table `compose_whatsapp_4`
--
ALTER TABLE `compose_whatsapp_4`
  ADD PRIMARY KEY (`compose_whatsapp_id`),
  ADD KEY `user_id` (`user_id`,`store_id`,`whatspp_config_id`);

--
-- Indexes for table `compose_whatsapp_status_4`
--
ALTER TABLE `compose_whatsapp_status_4`
  ADD PRIMARY KEY (`comwtap_status_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- Indexes for table `compose_whatsapp_status_tmpl_4`
--
ALTER TABLE `compose_whatsapp_status_tmpl_4`
  ADD PRIMARY KEY (`comwtap_status_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`),
  ADD KEY `mobile_no` (`mobile_no`),
  ADD KEY `report_group` (`report_group`);

--
-- Indexes for table `compose_whatsapp_tmpl_4`
--
ALTER TABLE `compose_whatsapp_tmpl_4`
  ADD PRIMARY KEY (`compose_whatsapp_id`),
  ADD KEY `user_id` (`user_id`,`store_id`,`whatspp_config_id`);

--
-- Indexes for table `whatsapp_text_4`
--
ALTER TABLE `whatsapp_text_4`
  ADD PRIMARY KEY (`whatsapp_text_id`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- Indexes for table `whatsapp_text_tmpl_4`
--
ALTER TABLE `whatsapp_text_tmpl_4`
  ADD PRIMARY KEY (`compose_whatsapp_msgid`),
  ADD KEY `compose_whatsapp_id` (`compose_whatsapp_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compose_whatsapp_4`
--
ALTER TABLE `compose_whatsapp_4`
  MODIFY `compose_whatsapp_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compose_whatsapp_status_4`
--
ALTER TABLE `compose_whatsapp_status_4`
  MODIFY `comwtap_status_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compose_whatsapp_status_tmpl_4`
--
ALTER TABLE `compose_whatsapp_status_tmpl_4`
  MODIFY `comwtap_status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `compose_whatsapp_tmpl_4`
--
ALTER TABLE `compose_whatsapp_tmpl_4`
  MODIFY `compose_whatsapp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `whatsapp_text_4`
--
ALTER TABLE `whatsapp_text_4`
  MODIFY `whatsapp_text_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_text_tmpl_4`
--
ALTER TABLE `whatsapp_text_tmpl_4`
  MODIFY `compose_whatsapp_msgid` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
