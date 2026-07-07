-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 08, 2026 lúc 07:28 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tim_thue_tro`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `icon_tag` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `icon_tag`) VALUES
(7, 'Wifi', 'wifi'),
(8, 'Điều hòa', 'air-conditioner'),
(9, 'Máy giặt', 'washing-machine'),
(10, 'Tủ lạnh', 'refrigerator'),
(11, 'Bãi đỗ xe', 'p-square'),
(12, 'Bảo vệ 24/7', 'shield-check');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `icon_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT 'Home',
  `color` varchar(20) COLLATE utf8_unicode_ci DEFAULT '#3b82f6',
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon_name`, `color`, `description`) VALUES
(1, 'Phòng trọ', 'Home', '#3b82f6', NULL),
(2, 'Căn hộ', 'Building2', '#8b5cf6', NULL),
(3, 'Ký túc xá', 'Users', '#ec4899', NULL),
(4, 'Nhà nguyên căn', 'LayoutGrid', '#f59e0b', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contracts`
--

CREATE TABLE `contracts` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `signed_price` decimal(15,2) NOT NULL,
  `signed_deposit` decimal(15,2) NOT NULL,
  `billing_cycle` int(11) DEFAULT 1,
  `status` enum('ACTIVE','EXPIRED','TERMINATED') COLLATE utf8_unicode_ci DEFAULT 'ACTIVE',
  `pdf_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contracts`
--

INSERT INTO `contracts` (`id`, `room_id`, `tenant_id`, `start_date`, `end_date`, `signed_price`, `signed_deposit`, `billing_cycle`, `status`, `pdf_url`) VALUES
(1, 1, 31, '2025-01-01', '2026-01-01', '3500000.00', '3000000.00', 1, 'ACTIVE', NULL),
(2, 4, 28, '2025-01-01', '2026-01-01', '3500000.00', '3000000.00', 1, 'ACTIVE', NULL),
(3, 7, 32, '2025-01-01', '2026-01-01', '3500000.00', '3000000.00', 1, 'ACTIVE', NULL),
(4, 10, 30, '2025-01-01', '2026-01-01', '3500000.00', '3000000.00', 1, 'ACTIVE', NULL),
(6, 2, 28, '2026-04-20', '2026-05-20', '4000000.00', '4000000.00', 0, 'ACTIVE', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  `landlord_id` int(11) DEFAULT NULL,
  `last_message` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `conversations`
--

INSERT INTO `conversations` (`id`, `tenant_id`, `landlord_id`, `last_message`, `updated_at`) VALUES
(1, 28, 24, 'Em chào anh, em muốn xem phòng ạ.', '2026-03-13 15:44:25'),
(2, 29, 25, 'Em chào anh, em muốn xem phòng ạ.', '2026-03-13 15:44:25'),
(3, 30, 26, 'Em chào anh, em muốn xem phòng ạ.', '2026-03-13 15:44:25'),
(4, 31, 27, 'Em chào anh, em muốn xem phòng ạ.', '2026-03-13 15:44:25'),
(5, 32, 24, 'Em chào anh, em muốn xem phòng ạ.', '2026-03-13 15:44:25'),
(6, 28, 27, 'Bắt đầu cuộc trò chuyện mới', '2026-03-14 17:35:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `favorites`
--

INSERT INTO `favorites` (`user_id`, `post_id`) VALUES
(28, 1),
(28, 2),
(29, 1),
(29, 2),
(30, 1),
(30, 2),
(31, 2),
(32, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `contract_id` int(11) DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `service_fees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`service_fees`)),
  `payment_status` enum('UNPAID','PAID','OVERDUE') COLLATE utf8_unicode_ci DEFAULT 'UNPAID',
  `payment_method` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `contract_id`, `invoice_date`, `total_amount`, `service_fees`, `payment_status`, `payment_method`, `paid_at`) VALUES
(1, 1, '2025-03-01', '3500000.00', NULL, 'PAID', NULL, '2026-03-13 15:44:24'),
(2, 1, '2025-04-01', '3500000.00', NULL, 'UNPAID', NULL, NULL),
(5, 3, '2025-03-01', '3500000.00', NULL, 'PAID', NULL, '2026-03-13 15:44:24'),
(6, 3, '2025-04-01', '3500000.00', NULL, 'UNPAID', NULL, NULL),
(7, 4, '2025-03-01', '3500000.00', NULL, 'PAID', NULL, '2026-03-13 15:44:25'),
(8, 4, '2025-04-01', '3500000.00', NULL, 'UNPAID', NULL, NULL),
(15, 6, '2026-05-20', '4500000.00', '{\"electricity\":\"300000\",\"water\":\"100000\",\"internet\":\"100000\",\"other\":\"0\"}', 'PAID', NULL, NULL),
(18, 6, '2026-04-20', '4575000.00', '{\"electricity\":\"350000\",\"water\":\"100000\",\"internet\":\"100000\",\"other\":\"025000\"}', 'PAID', NULL, NULL),
(19, 6, '2026-03-20', '4000000.00', '{\"electricity\":0,\"water\":0,\"internet\":0,\"other\":0}', 'PAID', NULL, '2026-05-20 08:31:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `message_type` enum('TEXT','IMAGE','ROOM_LINK') COLLATE utf8_unicode_ci DEFAULT 'TEXT',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `message_type`, `is_read`, `created_at`) VALUES
(1, 1, 28, 'Em chào anh, em muốn xem phòng ạ.', 'TEXT', 1, '2026-03-13 15:44:25'),
(2, 1, 24, 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?', 'TEXT', 1, '2026-03-13 15:44:25'),
(3, 2, 29, 'Em chào anh, em muốn xem phòng ạ.', 'TEXT', 0, '2026-03-13 15:44:25'),
(4, 2, 25, 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?', 'TEXT', 0, '2026-03-13 15:44:25'),
(5, 3, 30, 'Em chào anh, em muốn xem phòng ạ.', 'TEXT', 0, '2026-03-13 15:44:25'),
(6, 3, 26, 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?', 'TEXT', 0, '2026-03-13 15:44:25'),
(7, 4, 31, 'Em chào anh, em muốn xem phòng ạ.', 'TEXT', 0, '2026-03-13 15:44:25'),
(8, 4, 27, 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?', 'TEXT', 0, '2026-03-13 15:44:25'),
(9, 5, 32, 'Em chào anh, em muốn xem phòng ạ.', 'TEXT', 1, '2026-03-13 15:44:25'),
(10, 5, 24, 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?', 'TEXT', 0, '2026-03-13 15:44:25'),
(11, 1, 23, 'alo', 'TEXT', 1, '2026-03-14 03:46:19'),
(12, 1, 24, 'kkk', 'TEXT', 1, '2026-03-14 05:34:43'),
(13, 1, 24, 'chào em , em muốn xem phòng gì', 'TEXT', 1, '2026-03-14 05:37:18'),
(14, 1, 24, 'Hello', 'TEXT', 1, '2026-03-14 05:38:38'),
(15, 5, 24, 'hi emn', 'TEXT', 0, '2026-03-14 05:38:53'),
(16, 1, 28, 'alo anh', 'TEXT', 1, '2026-03-14 17:20:42'),
(17, 1, 28, 'anh ơi', 'TEXT', 1, '2026-03-14 17:26:25'),
(18, 1, 28, 'hello', 'TEXT', 1, '2026-03-14 17:33:40'),
(19, 1, 24, 'hi', 'TEXT', 1, '2026-03-14 17:48:57'),
(20, 1, 28, 'chaà a', 'TEXT', 1, '2026-03-14 17:49:15'),
(21, 1, 24, 'chào e', 'TEXT', 1, '2026-03-14 17:49:20'),
(22, 1, 24, 'helolo', 'TEXT', 1, '2026-03-14 17:49:35'),
(23, 1, 28, 'alo', 'TEXT', 1, '2026-03-21 07:42:17'),
(24, 1, 24, 'hello em', 'TEXT', 1, '2026-03-21 07:42:33'),
(25, 6, 28, 'em chao chị', 'TEXT', 0, '2026-05-20 06:49:52'),
(26, 1, 28, 'em muốn thuê phòmg', 'TEXT', 1, '2026-05-20 06:52:52'),
(27, 1, 24, 'ok em', 'TEXT', 1, '2026-05-20 06:55:07');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','EXPIRED','HIDDEN') COLLATE utf8_unicode_ci DEFAULT 'PENDING',
  `priority_score` int(11) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `room_id`, `title`, `content`, `status`, `priority_score`, `view_count`, `created_at`) VALUES
(1, 2, 'Cho thuê Phòng 102 - PG Apartment 2', 'cần cho thuê gấp phòng 102 tại 59 Nguyễn Đình Hiến , Diện Tích 30m2, Giá 4000000 VNĐ, Full Tiện ích', 'ACTIVE', 0, 0, '2026-03-13 15:44:24'),
(2, 3, 'Cho thuê Phòng 103 - PG Apartment 1', 'cần cho thuê gấp phòng 103 tại 36 - 38 Nguyễn Tạo , Diện Tích 35m2, Giá 4500000 VNĐ, Full Tiện ích', 'ACTIVE', 0, 0, '2026-03-13 15:44:24'),
(3, 5, 'Cho thuê Phòng 102 - Nhà trọ cao cấp Trần Thái Tông', 'Cần cho thuê gấp Phòng 102 tại 45 Trần Thái Tông. Diện tích 30m2, giá 4000000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:24'),
(4, 6, 'Cho thuê Phòng 103 - Nhà trọ cao cấp Trần Thái Tông', 'Cần cho thuê gấp Phòng 103 tại 45 Trần Thái Tông. Diện tích 35m2, giá 4500000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:24'),
(5, 8, 'Cho thuê Phòng 102 - Khu trọ sinh viên Hồ Tùng Mậu', 'Cần cho thuê gấp Phòng 102 tại 99 Hồ Tùng Mậu. Diện tích 30m2, giá 4000000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:25'),
(6, 9, 'Cho thuê Phòng 103 - Khu trọ sinh viên Hồ Tùng Mậu', 'Cần cho thuê gấp Phòng 103 tại 99 Hồ Tùng Mậu. Diện tích 35m2, giá 4500000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:25'),
(7, 11, 'Cho thuê Phòng 102 - Căn hộ dịch vụ Duy Tân', 'Cần cho thuê gấp Phòng 102 tại 88 Duy Tân. Diện tích 30m2, giá 4000000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:25'),
(8, 12, 'Cho thuê Phòng 103 - Căn hộ dịch vụ Duy Tân', 'Cần cho thuê gấp Phòng 103 tại 88 Duy Tân. Diện tích 35m2, giá 4500000 VNĐ. Full tiện ích.', 'ACTIVE', 0, 0, '2026-03-13 15:44:25'),
(9, 14, 'Cho thuê Phòng 102 - PG Apartment 2', '<p>Cần&nbsp;cho&nbsp;thuê&nbsp;gấp&nbsp;Phòng&nbsp;102&nbsp;tại&nbsp;59&nbsp;Nguyễn&nbsp;Đình&nbsp;Hiến.&nbsp;Diện&nbsp;tích&nbsp;30m2,&nbsp;giá&nbsp;4000000&nbsp;VNĐ.&nbsp;Full&nbsp;tiện&nbsp;ích.</p>', 'ACTIVE', 0, 0, '2026-03-13 15:44:25'),
(12, 16, 'phòng mới , đầy đủ tiện ích', '<p>10&nbsp;điểm&nbsp;k&nbsp;có&nbsp;nhứng</p>', 'PENDING', 0, 0, '2026-05-15 16:36:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_images`
--

CREATE TABLE `post_images` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_thumbnail` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `post_images`
--

INSERT INTO `post_images` (`id`, `post_id`, `image_url`, `is_thumbnail`) VALUES
(3, 3, 'https://picsum.photos/seed/3/800/600', 0),
(4, 4, 'https://picsum.photos/seed/4/800/600', 0),
(5, 5, 'https://picsum.photos/seed/5/800/600', 0),
(6, 6, 'https://picsum.photos/seed/6/800/600', 0),
(7, 7, 'https://picsum.photos/seed/7/800/600', 0),
(8, 8, 'https://picsum.photos/seed/8/800/600', 0),
(18, 12, 'http://localhost:5000/uploads/1778863009081-711166284.png', 1),
(20, 2, 'https://picsum.photos/seed/2/800/600', 1),
(21, 9, 'https://picsum.photos/seed/9/800/600', 1),
(22, 1, 'https://picsum.photos/seed/1/800/600', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `profiles`
--

CREATE TABLE `profiles` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `id_card_number` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_card_date` date DEFAULT NULL,
  `address_permanent` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `profiles`
--

INSERT INTO `profiles` (`user_id`, `full_name`, `gender`, `date_of_birth`, `id_card_number`, `id_card_date`, `address_permanent`, `avatar_url`, `bio`) VALUES
(23, 'Nguyễn Đình Luân', NULL, NULL, NULL, NULL, 'Đà Nẵng, Việt Nam', NULL, NULL),
(24, 'Trần Văn Thành', NULL, NULL, '001100001213', NULL, 'Đà Nẵng, Việt Nam', NULL, NULL),
(25, 'Lê Thị Lan', NULL, NULL, NULL, NULL, 'Hà Nội, Việt Nam', NULL, NULL),
(26, 'Phạm Thế Hùng', NULL, NULL, NULL, NULL, 'TP Hồ Chí Minh, Việt Nam', NULL, NULL),
(27, 'Hoàng Tuyết Mai', NULL, NULL, NULL, NULL, 'Hà Nội, Việt Nam', NULL, NULL),
(28, 'Đặng Tiến Dũng', NULL, NULL, NULL, NULL, 'Đà Nẵng, Việt Nam', NULL, NULL),
(29, 'Trịnh Quỳnh Hoa', NULL, NULL, NULL, NULL, 'Hà Nội, Việt Nam', NULL, NULL),
(30, 'Vũ Hoài Nam', NULL, NULL, NULL, NULL, 'TP Hồ Chí Minh, Việt Nam', NULL, NULL),
(31, 'Ngô Mỹ Linh', NULL, NULL, NULL, NULL, 'Hà Nội, Việt Nam', NULL, NULL),
(32, 'Bùi Minh Quân', NULL, NULL, NULL, NULL, 'TP Hồ Chí Minh, Việt Nam', NULL, NULL),
(33, 'Nguyen Van Zung', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 'Nguyễn Văn Quyết', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `landlord_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `address_street` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ward` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `district` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `general_rules` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','HIDDEN','REJECTED') COLLATE utf8_unicode_ci DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `properties`
--

INSERT INTO `properties` (`id`, `landlord_id`, `name`, `address_street`, `ward`, `district`, `city`, `latitude`, `longitude`, `description`, `general_rules`, `status`) VALUES
(1, 24, 'PG Apartment 1', '36-38 Nguyễn Tạo', 'Hòa Hải', 'Ngũ Hành Sơn', 'Đà Nẵng', NULL, NULL, 'Khu nhà trọ an ninh, sạch sẽ tại khu vực Ngũ Hành Sơn. Gần các trường đại học VKU, FPT, Cao Đẳng du lịch và Khu đô thị FPTT.', NULL, 'ACTIVE'),
(2, 25, 'Nhà trọ cao cấp Trần Thái Tông', '45 Trần Thái Tông', 'Dịch Vọng', 'Cầu Giấy', 'Hà Nội', NULL, NULL, 'Khu nhà trọ an ninh, sạch sẽ tại khu vực Dịch Vọng. Gần các trường đại học và bến xe.', NULL, 'PENDING'),
(3, 26, 'Khu trọ sinh viên NANCY HOUSE', '375 , Phạm Văn Chiêu', 'Thông Tây Hội', 'Gò Vấp', 'TP Hồ Chí Minh', NULL, NULL, 'Khu nhà trọ an ninh, sạch sẽ tại khu vực Gò Vấp. Gần các trường đại học và bến xe.', NULL, 'ACTIVE'),
(4, 27, 'Căn hộ dịch vụ Duy Tân', '88 Duy Tân', 'Dịch Vọng Hậu', 'Cầu Giấy', 'Hà Nội', NULL, NULL, 'Khu nhà trọ an ninh, sạch sẽ tại khu vực Dịch Vọng Hậu. Gần các trường đại học và bến xe.', NULL, 'PENDING'),
(5, 24, 'PG Apartment 2 ', '59, Nguyễn Đình Hiến', 'Hòa Hải', 'Ngũ Hành Sơn', 'Đà Nẵng', NULL, NULL, 'Khu nhà trọ an ninh, sạch sẽ tại khu vực Ngũ Hành Sơn. Gần các trường đại học VKU, FPT, cao đẳng du lịch và gần khu đô thị FPT và FPT software.', NULL, 'ACTIVE');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `reported_user_id` int(11) DEFAULT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `reason` text COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','RESOLVED','REJECTED') COLLATE utf8_unicode_ci DEFAULT 'PENDING',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reports`
--

INSERT INTO `reports` (`id`, `reporter_id`, `reported_user_id`, `conversation_id`, `post_id`, `reason`, `description`, `status`, `created_at`) VALUES
(1, 28, 24, 1, NULL, 'Người dùng có hành vi không phù hợp / Lừa đảo', NULL, 'PENDING', '2026-03-14 17:29:16'),
(2, 28, NULL, NULL, NULL, 'Nội dung vi phạm / Lừa đảo', NULL, 'PENDING', '2026-05-15 11:46:59'),
(3, 28, 25, NULL, NULL, 'Lừa đảo / Đặt cọc giả', NULL, 'PENDING', '2026-05-15 12:00:49'),
(4, 28, 25, NULL, NULL, 'Khác', NULL, 'PENDING', '2026-05-15 12:01:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `comment` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `room_id`, `rating`, `comment`, `created_at`) VALUES
(1, 31, 1, 4, 'Phòng rất đẹp, chủ nhà nhiệt tình.', '2026-03-13 15:44:25'),
(2, 30, 2, 4, 'Phòng rất đẹp, chủ nhà nhiệt tình.', '2026-03-13 15:44:25'),
(3, 28, 3, 5, 'Phòng rất đẹp, chủ nhà nhiệt tình.', '2026-03-13 15:44:25'),
(4, 28, 4, 5, 'Phòng rất đẹp, chủ nhà nhiệt tình.', '2026-03-13 15:44:25'),
(5, 31, 5, 5, 'Phòng rất đẹp, chủ nhà nhiệt tình.', '2026-03-13 15:44:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'ADMIN'),
(2, 'LANDLORD'),
(3, 'TENANT');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `room_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `area` float NOT NULL,
  `max_occupants` int(11) DEFAULT 2,
  `base_price` decimal(15,2) NOT NULL,
  `deposit_amount` decimal(15,2) NOT NULL,
  `status` enum('PENDING','AVAILABLE','RENTED','DEPOSITED','MAINTENANCE') COLLATE utf8_unicode_ci DEFAULT 'PENDING',
  `has_mezzanine` tinyint(1) DEFAULT 0,
  `images` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(50) COLLATE utf8_unicode_ci DEFAULT 'Phòng trọ',
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `property_id`, `room_name`, `area`, `max_occupants`, `base_price`, `deposit_amount`, `status`, `has_mezzanine`, `images`, `type`, `category_id`) VALUES
(1, 2, 'Phòng 101', 25, 2, '3500000.00', '3000000.00', 'RENTED', 0, NULL, 'Phòng trọ', 1),
(2, 5, 'Phòng 104', 31, 2, '4000000.00', '3000000.00', 'RENTED', 1, '[]', 'Phòng trọ', 1),
(3, 1, 'Phòng 103', 35, 2, '4500000.00', '3000000.00', 'AVAILABLE', 0, NULL, 'Phòng trọ', 1),
(4, 2, 'Phòng 101', 25, 2, '3500000.00', '3000000.00', 'RENTED', 0, NULL, 'Phòng trọ', 1),
(5, 2, 'Phòng 102', 30, 2, '4000000.00', '3000000.00', 'AVAILABLE', 1, NULL, 'Phòng trọ', 1),
(6, 2, 'Phòng 103', 35, 2, '4500000.00', '3000000.00', 'AVAILABLE', 0, NULL, 'Phòng trọ', 1),
(7, 3, 'Phòng 101', 25, 2, '3500000.00', '3000000.00', 'RENTED', 0, NULL, 'Phòng trọ', 1),
(8, 3, 'Phòng 102', 30, 2, '4000000.00', '3000000.00', 'AVAILABLE', 1, NULL, 'Phòng trọ', 1),
(9, 3, 'Phòng 103', 35, 2, '4500000.00', '3000000.00', 'AVAILABLE', 0, NULL, 'Phòng trọ', 1),
(10, 4, 'Phòng 101', 25, 2, '3500000.00', '3000000.00', 'RENTED', 0, NULL, 'Phòng trọ', 1),
(11, 4, 'Phòng 102', 30, 2, '4000000.00', '3000000.00', 'AVAILABLE', 1, NULL, 'Phòng trọ', 1),
(12, 4, 'Phòng 103', 35, 2, '4500000.00', '3000000.00', 'AVAILABLE', 0, NULL, 'Phòng trọ', 1),
(14, 5, 'Phòng 102', 30, 2, '4000000.00', '3000000.00', 'AVAILABLE', 1, NULL, 'Phòng trọ', 1),
(15, 5, 'Phòng 103', 35, 2, '4500000.00', '3000000.00', 'AVAILABLE', 0, '[]', 'Phòng trọ', 1),
(16, 3, 'phòng 104', 30, 2, '3500000.00', '3500000.00', 'PENDING', 1, '[\"http://localhost:5000/uploads/1778862931544-856498483.jpg\"]', 'Phòng trọ', NULL),
(17, 1, 'Phòng 101', 25, 2, '3500000.00', '3500000.00', 'AVAILABLE', 1, '[\"http://localhost:5000/uploads/1778997705803-700488963.jpg\"]', 'Phòng trọ', NULL),
(18, 5, 'Phòng 101', 30, 2, '4500000.00', '4500000.00', 'PENDING', 1, '[\"http://localhost:5000/uploads/1779264045723-463135086.jpg\"]', 'Phòng trọ', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_amenities`
--

CREATE TABLE `room_amenities` (
  `room_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_amenities`
--

INSERT INTO `room_amenities` (`room_id`, `amenity_id`) VALUES
(1, 9),
(1, 10),
(1, 12),
(2, 7),
(2, 8),
(2, 11),
(3, 7),
(3, 10),
(3, 12),
(4, 8),
(4, 9),
(4, 10),
(5, 9),
(5, 10),
(5, 12),
(6, 9),
(6, 10),
(6, 12),
(7, 8),
(7, 9),
(7, 10),
(8, 8),
(8, 9),
(8, 10),
(9, 7),
(9, 9),
(9, 10),
(10, 7),
(10, 10),
(10, 12),
(11, 8),
(11, 9),
(11, 10),
(12, 7),
(12, 8),
(12, 12),
(14, 7),
(14, 8),
(14, 11),
(15, 7),
(15, 8),
(15, 9);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `refresh_token` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `phone_number`, `role_id`, `is_verified`, `refresh_token`, `last_login`, `created_at`, `updated_at`) VALUES
(23, 'admin@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0901234567', 1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc4MDkzODI5OCwiZXhwIjoxNzgxNTQzMDk4fQ.OcYEWNMXY215q841mkjJA7Jo7_dWO03E6zvLjpDQ3Q0', '2026-06-08 17:04:58', '2026-03-13 15:44:24', '2026-06-08 17:04:58'),
(24, 'chu_tro_thanh@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0912233445', 2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImlhdCI6MTc4MDQ0NzkxMywiZXhwIjoxNzgxMDUyNzEzfQ.y4_uAeSbxNdOA2OOqTvpCiK7iPBhcUYgOd2PjhzEpW8', '2026-06-03 00:51:53', '2026-03-13 15:44:24', '2026-06-03 00:51:53'),
(25, 'chu_tro_lan@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0913344556', 2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImlhdCI6MTc3OTI2MDc0OCwiZXhwIjoxNzc5ODY1NTQ4fQ.BibixtFkdBU6WXQsX_osa9aUVnNxpdA14ORbG4oft_Q', '2026-05-20 07:05:48', '2026-03-13 15:44:24', '2026-05-20 07:05:48'),
(26, 'chu_tro_hung@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0914455667', 2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImlhdCI6MTc3OTI2MDg5NywiZXhwIjoxNzc5ODY1Njk3fQ.WU83mhHH5kmR0g1bIWKCL7I9xb3dW_2kMgQg8jPhOv4', '2026-05-20 07:08:17', '2026-03-13 15:44:24', '2026-05-20 07:08:17'),
(27, 'chu_tro_mai@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0915566778', 2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImlhdCI6MTc3OTI2MDg0MCwiZXhwIjoxNzc5ODY1NjQwfQ.7EM1g2QKU7vexkOcG9Dz8VJHrqrx-rWPPYJCtLgGEG0', '2026-05-20 07:07:20', '2026-03-13 15:44:24', '2026-05-20 07:07:20'),
(28, 'khach_thue_dung@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0981122334', 3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsImlhdCI6MTc4MDQ0ODM4NywiZXhwIjoxNzgxMDUzMTg3fQ.fjY3FQpTwjZrTZXgGz4pcE-RTfEobyIpdwaVUPrS8Sc', '2026-06-03 00:59:47', '2026-03-13 15:44:24', '2026-06-03 00:59:47'),
(29, 'khach_thue_hoa@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0982233445', 3, 1, NULL, NULL, '2026-03-13 15:44:24', '2026-03-13 15:44:24'),
(30, 'khach_thue_nam@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0983344556', 3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTc3ODg2NDgxMywiZXhwIjoxNzc5NDY5NjEzfQ.dnC4DKYQ-BEjQxp_spmzf2gRfzllOvlVt8IVrUoGnWY', '2026-05-15 17:06:53', '2026-03-13 15:44:24', '2026-05-15 17:06:53'),
(31, 'khach_thue_linh@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0984455667', 3, 1, NULL, NULL, '2026-03-13 15:44:24', '2026-03-13 15:44:24'),
(32, 'khach_thue_quan@example.com', '$2b$10$6QYCL45g5P5rqtJRvXhcCOlaluujIZuzisQqRimSgYrVL0T.GTvRi', '0985566778', 3, 1, NULL, NULL, '2026-03-13 15:44:24', '2026-03-13 15:44:24'),
(33, 'nguyenvanzung@example.com', '$2b$10$LjWLo1OMbCnlNmMVRJxnnuAc6EXhX1LSMFYJlRBw70Bp.PpjlO7Wu', '0222333555', 3, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzMsImlhdCI6MTc3MzUwODc2NiwiZXhwIjoxNzc0MTEzNTY2fQ.BWrWj4Yfgq34nahX_XVgCVGNx1otVIo3-FI_5LVGpgM', '2026-03-14 17:19:26', '2026-03-14 17:11:18', '2026-03-14 17:19:26'),
(34, 'chu_tro_quyet@example.com', '$2b$10$9ETHyYAJEjHnCrO8SFdvqeIxnq732uptbtIlCR6lO5ZppsDI6uwQu', '090572723', 2, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImlhdCI6MTc3ODg2MjM4NSwiZXhwIjoxNzc5NDY3MTg1fQ.j38MYPkKSQWg0fuZ0CFW-cLM4Wbo6A-c-Khq3cfUIUo', '2026-05-15 16:26:25', '2026-05-15 16:23:55', '2026-05-15 16:26:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browser` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip_address` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `platform` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_active` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `device_name`, `browser`, `ip_address`, `platform`, `last_active`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.4', 'Unknown Platform', '2026-03-14 11:32:17', 1, '2026-03-14 11:32:17', '2026-03-14 11:32:17'),
(2, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.11', 'Unknown Platform', '2026-03-14 12:33:35', 1, '2026-03-14 12:33:35', '2026-03-14 12:33:35'),
(3, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 13:44:37', 1, '2026-03-14 13:44:37', '2026-03-14 13:44:37'),
(4, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 13:57:31', 1, '2026-03-14 13:57:31', '2026-03-14 13:57:31'),
(5, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:14:03', 1, '2026-03-14 16:14:03', '2026-03-14 16:14:03'),
(6, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:17:12', 1, '2026-03-14 16:17:12', '2026-03-14 16:17:12'),
(7, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:18:23', 1, '2026-03-14 16:18:23', '2026-03-14 16:18:23'),
(8, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:27:42', 1, '2026-03-14 16:27:42', '2026-03-14 16:27:42'),
(9, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:28:19', 1, '2026-03-14 16:28:19', '2026-03-14 16:28:19'),
(10, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:29:37', 1, '2026-03-14 16:29:37', '2026-03-14 16:29:37'),
(11, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:30:20', 1, '2026-03-14 16:30:20', '2026-03-14 16:30:20'),
(12, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:41:18', 1, '2026-03-14 16:41:18', '2026-03-14 16:41:18'),
(13, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:41:58', 1, '2026-03-14 16:41:58', '2026-03-14 16:41:58'),
(14, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:45:56', 1, '2026-03-14 16:45:56', '2026-03-14 16:45:56'),
(15, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:49:27', 1, '2026-03-14 16:49:27', '2026-03-14 16:49:27'),
(16, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:56:12', 1, '2026-03-14 16:56:12', '2026-03-14 16:56:12'),
(17, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 16:58:15', 1, '2026-03-14 16:58:15', '2026-03-14 16:58:15'),
(18, 33, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:11:29', 1, '2026-03-14 17:11:29', '2026-03-14 17:11:29'),
(19, 33, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:18:30', 1, '2026-03-14 17:18:30', '2026-03-14 17:18:30'),
(20, 33, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:19:26', 1, '2026-03-14 17:19:26', '2026-03-14 17:19:26'),
(21, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:20:30', 1, '2026-03-14 17:20:30', '2026-03-14 17:20:30'),
(22, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:24:02', 1, '2026-03-14 17:24:02', '2026-03-14 17:24:02'),
(23, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:26:15', 1, '2026-03-14 17:26:15', '2026-03-14 17:26:15'),
(24, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:29:04', 1, '2026-03-14 17:29:04', '2026-03-14 17:29:04'),
(25, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:33:25', 1, '2026-03-14 17:33:25', '2026-03-14 17:33:25'),
(26, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-03-14 17:37:31', 1, '2026-03-14 17:37:31', '2026-03-14 17:37:31'),
(27, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-03-14 17:48:46', 1, '2026-03-14 17:48:46', '2026-03-14 17:48:46'),
(28, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-03-21 07:32:34', 1, '2026-03-21 07:32:34', '2026-03-21 07:32:34'),
(29, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-03-21 07:33:54', 1, '2026-03-21 07:33:54', '2026-03-21 07:33:54'),
(30, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.13', 'Unknown Platform', '2026-03-21 07:41:21', 1, '2026-03-21 07:41:21', '2026-03-21 07:41:21'),
(31, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:26:04', 1, '2026-05-15 10:26:04', '2026-05-15 10:26:04'),
(32, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:29:39', 1, '2026-05-15 10:29:39', '2026-05-15 10:29:39'),
(33, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:33:22', 1, '2026-05-15 10:33:22', '2026-05-15 10:33:22'),
(34, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:35:45', 1, '2026-05-15 10:35:45', '2026-05-15 10:35:45'),
(35, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:41:51', 1, '2026-05-15 10:41:51', '2026-05-15 10:41:51'),
(36, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 10:57:28', 1, '2026-05-15 10:57:28', '2026-05-15 10:57:28'),
(37, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.9', 'Unknown Platform', '2026-05-15 11:04:17', 1, '2026-05-15 11:04:17', '2026-05-15 11:04:17'),
(38, 34, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 16:26:25', 1, '2026-05-15 16:26:25', '2026-05-15 16:26:25'),
(39, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 16:28:09', 1, '2026-05-15 16:28:09', '2026-05-15 16:28:09'),
(40, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 16:29:55', 1, '2026-05-15 16:29:55', '2026-05-15 16:29:55'),
(41, 26, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-15 16:34:04', 1, '2026-05-15 16:34:04', '2026-05-15 16:34:04'),
(42, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-15 16:46:47', 1, '2026-05-15 16:46:47', '2026-05-15 16:46:47'),
(43, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-15 17:03:59', 1, '2026-05-15 17:03:59', '2026-05-15 17:03:59'),
(44, 30, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-15 17:06:53', 1, '2026-05-15 17:06:53', '2026-05-15 17:06:53'),
(45, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-16 04:07:22', 1, '2026-05-16 04:07:22', '2026-05-16 04:07:22'),
(46, 26, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-17 05:26:28', 1, '2026-05-17 05:26:28', '2026-05-17 05:26:28'),
(47, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-17 05:29:10', 1, '2026-05-17 05:29:10', '2026-05-17 05:29:10'),
(48, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', NULL, '::1', '\"Windows\"', '2026-05-17 05:44:05', 1, '2026-05-17 05:44:05', '2026-05-17 05:44:05'),
(49, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', NULL, '::1', '\"Windows\"', '2026-05-17 06:01:54', 1, '2026-05-17 06:01:54', '2026-05-17 06:01:54'),
(50, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-17 07:53:17', 1, '2026-05-17 07:53:17', '2026-05-17 07:53:17'),
(51, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-20 06:16:06', 1, '2026-05-20 06:16:06', '2026-05-20 06:16:06'),
(52, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-20 06:54:49', 1, '2026-05-20 06:54:49', '2026-05-20 06:54:49'),
(53, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-20 07:03:34', 1, '2026-05-20 07:03:34', '2026-05-20 07:03:34'),
(54, 25, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-20 07:05:48', 1, '2026-05-20 07:05:48', '2026-05-20 07:05:48'),
(55, 27, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-20 07:07:20', 1, '2026-05-20 07:07:20', '2026-05-20 07:07:20'),
(56, 26, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-20 07:08:17', 1, '2026-05-20 07:08:17', '2026-05-20 07:08:17'),
(57, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-05-20 07:29:34', 1, '2026-05-20 07:29:34', '2026-05-20 07:29:34'),
(58, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-24 06:59:06', 1, '2026-05-24 06:59:06', '2026-05-24 06:59:06'),
(59, 28, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-05-24 07:11:57', 1, '2026-05-24 07:11:57', '2026-05-24 07:11:57'),
(60, 24, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-06-03 00:51:53', 1, '2026-06-03 00:51:53', '2026-06-03 00:51:53'),
(61, 23, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', NULL, '::1', '\"Windows\"', '2026-06-03 00:55:53', 1, '2026-06-03 00:55:53', '2026-06-03 00:55:53'),
(62, 28, 'okhttp/4.12.0', NULL, '::ffff:172.26.61.172', 'Unknown Platform', '2026-06-03 00:59:48', 1, '2026-06-03 00:59:48', '2026-06-03 00:59:48'),
(63, 23, 'okhttp/4.12.0', NULL, '::ffff:172.26.61.172', 'Unknown Platform', '2026-06-03 01:37:14', 1, '2026-06-03 01:37:14', '2026-06-03 01:37:14'),
(64, 23, 'okhttp/4.12.0', NULL, '::ffff:192.168.1.186', 'Unknown Platform', '2026-06-08 17:04:58', 1, '2026-06-08 17:04:58', '2026-06-08 17:04:58');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Chỉ mục cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `landlord_id` (`landlord_id`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Chỉ mục cho bảng `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `id_card_number` (`id_card_number`);

--
-- Chỉ mục cho bảng `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `landlord_id` (`landlord_id`);

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `reported_user_id` (`reported_user_id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `fk_report_post` (`post_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`),
  ADD UNIQUE KEY `role_name_2` (`role_name`),
  ADD UNIQUE KEY `role_name_3` (`role_name`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rooms_category_id_foreign_idx` (`category_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Chỉ mục cho bảng `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD PRIMARY KEY (`room_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `phone_number_2` (`phone_number`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `phone_number_3` (`phone_number`),
  ADD KEY `role_id` (`role_id`);

--
-- Chỉ mục cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_5` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_6` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `fk_report_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
