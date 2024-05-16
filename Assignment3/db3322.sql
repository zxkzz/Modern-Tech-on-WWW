-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： mydb:3306
-- 生成日期： 2024-04-11 14:23:37
-- 服务器版本： 8.3.0
-- PHP 版本： 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `db3322`
--

-- --------------------------------------------------------

--
-- 表的结构 `account`
--

CREATE TABLE `account` (
  `id` smallint NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `account`
--

INSERT INTO `account` (`id`, `email`, `password`) VALUES
(8, 'ken@connect.hku.hk', '123456'),
(9, 'tom@connect.hku.hk', '888888'),
(10, 'jerry@connect.hku.hk', '666666'),
(28, 'Floria@connect.hku.hk', '000');

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `msgid` int NOT NULL,
  `time` time NOT NULL,
  `message` varchar(250) NOT NULL,
  `person` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `message`
--

INSERT INTO `message` (`msgid`, `time`, `message`, `person`) VALUES
(18, '22:40:41', 'hello', 'ken'),
(19, '22:40:46', 'ciao', 'ken'),
(20, '22:40:52', 'hola', 'ken'),
(21, '22:41:18', 'hello', 'tom'),
(22, '22:41:21', 'hello', 'tom'),
(23, '22:41:25', 'ciao', 'tom'),
(24, '22:41:55', 'ciao a tuti', 'jerry'),
(25, '22:42:01', 'hello', 'jerry'),
(26, '22:42:15', 'Good evening', 'jerry'),
(27, '22:42:55', '12222    3333 22', 'ken'),
(32, '22:16:42', '11', 'ken'),
(33, '22:18:21', '11', 'ken'),
(34, '22:18:32', '122', 'ken');

--
-- 转储表的索引
--

--
-- 表的索引 `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`msgid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `account`
--
ALTER TABLE `account`
  MODIFY `id` smallint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- 使用表AUTO_INCREMENT `message`
--
ALTER TABLE `message`
  MODIFY `msgid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
