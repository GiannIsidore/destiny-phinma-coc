-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 03:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `destiny-coc`
--

-- --------------------------------------------------------

--
-- Table structure for table `books_tble`
--

CREATE TABLE `books_tble` (
  `id` int(11) NOT NULL,
  `title` varchar(225) NOT NULL,
  `destiny_url` varchar(225) NOT NULL,
  `added_at` datetime NOT NULL,
  `bib_id` varchar(100) NOT NULL,
  `img_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_blob`
--

CREATE TABLE `book_blob` (
  `id` int(11) NOT NULL,
  `book_img` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(105) NOT NULL,
  `descrip` text DEFAULT NULL,
  `link` varchar(225) DEFAULT NULL,
  `img_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_blob`
--

CREATE TABLE `event_blob` (
  `id` int(11) NOT NULL,
  `event_image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hk`
--

CREATE TABLE `hk` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `mname` varchar(20) DEFAULT NULL,
  `suffix` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `month` date NOT NULL,
  `course` int(11) NOT NULL,
  `img_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hk_blob`
--

CREATE TABLE `hk_blob` (
  `id` int(11) NOT NULL,
  `hk_image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sa`
--

CREATE TABLE `sa` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `mname` varchar(20) DEFAULT NULL,
  `suffix` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `month` date NOT NULL,
  `course` int(11) NOT NULL,
  `img_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sa_blob`
--

CREATE TABLE `sa_blob` (
  `id` int(11) NOT NULL,
  `sa_image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `updates_tble`
--

CREATE TABLE `updates_tble` (
  `id` int(11) NOT NULL,
  `reason` varchar(225) NOT NULL,
  `name` varchar(225) NOT NULL,
  `created_att` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_tble`
--

CREATE TABLE `user_tble` (
  `id` int(11) NOT NULL,
  `school_id` varchar(150) NOT NULL,
  `fname` varchar(150) NOT NULL,
  `lname` varchar(150) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `suffix` varchar(50) NOT NULL,
  `extension` varchar(30) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `password` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books_tble`
--
ALTER TABLE `books_tble`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book-img-policy` (`img_id`);

--
-- Indexes for table `book_blob`
--
ALTER TABLE `book_blob`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events-img-policy` (`img_id`);

--
-- Indexes for table `event_blob`
--
ALTER TABLE `event_blob`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hk`
--
ALTER TABLE `hk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hk-img-policy` (`img_id`);

--
-- Indexes for table `hk_blob`
--
ALTER TABLE `hk_blob`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sa`
--
ALTER TABLE `sa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sa-img-policy` (`img_id`);

--
-- Indexes for table `sa_blob`
--
ALTER TABLE `sa_blob`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_tble`
--
ALTER TABLE `user_tble`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books_tble`
--
ALTER TABLE `books_tble`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_blob`
--
ALTER TABLE `book_blob`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_blob`
--
ALTER TABLE `event_blob`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hk`
--
ALTER TABLE `hk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hk_blob`
--
ALTER TABLE `hk_blob`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sa`
--
ALTER TABLE `sa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sa_blob`
--
ALTER TABLE `sa_blob`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_tble`
--
ALTER TABLE `user_tble`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books_tble`
--
ALTER TABLE `books_tble`
  ADD CONSTRAINT `book-img-policy` FOREIGN KEY (`img_id`) REFERENCES `book_blob` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events-img-policy` FOREIGN KEY (`img_id`) REFERENCES `event_blob` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hk`
--
ALTER TABLE `hk`
  ADD CONSTRAINT `hk-img-policy` FOREIGN KEY (`img_id`) REFERENCES `hk_blob` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sa`
--
ALTER TABLE `sa`
  ADD CONSTRAINT `sa-img-policy` FOREIGN KEY (`img_id`) REFERENCES `sa_blob` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
