-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 01, 2018 at 03:42 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pizza_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customerID` varchar(20) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customerID`, `username`, `password`, `dob`, `firstname`, `lastname`, `address`, `pincode`, `phone`) VALUES
('rkPM4biSM', 'achasc@nwn.wov', '$2a$10$ezWNiliQN3rd294NL/sWtuEJKi5l4PHYdNDPYG5eWPGSXulNPU9F.', '2010-02-08', 'test', 'test', '100 jln ', '312312', '12345432');

-- --------------------------------------------------------

--
-- Table structure for table `fooditem`
--

CREATE TABLE `fooditem` (
  `foodItemID` varchar(20) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `category` enum('pizza','baked rice','pasta','beverages','specials') DEFAULT NULL,
  `price` float DEFAULT NULL,
  `image` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fooditem`
--

INSERT INTO `fooditem` (`foodItemID`, `name`, `description`, `category`, `price`, `image`) VALUES
('1', 'Mushroom baked rice', 'Mushroom baked rice', 'baked rice', 6, 'images/images_pizza/baked_rice/br_1.jpg'),
('2', 'Chicken baked rice', 'Chicken baked rice', 'baked rice', 8, 'images/images_pizza/baked_rice/br_2.jpg'),
('3', 'Chicken pizza', 'Chicken pizza', 'pizza', 16, 'images/images_pizza/pizza/piz_2.jpg'),
('4', 'Cheeze pizza', 'Cheeze pizza', 'pizza', 14, 'images/images_pizza/pizza/piz_3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `fooditemorder`
--

CREATE TABLE `fooditemorder` (
  `foodItemOrderID` varchar(20) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `size` enum('s','m','l') DEFAULT NULL,
  `totalPrice` float DEFAULT NULL,
  `FoodItem_foodItemID` varchar(20) NOT NULL,
  `Order_orderID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `orderID` varchar(100) NOT NULL,
  `paymentStatus` enum('paid','pending') DEFAULT NULL,
  `orderStatus` enum('assigned','delivered','canceled') DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` float DEFAULT NULL,
  `Payment_paymentID` varchar(100) NOT NULL,
  `Customer_customerID1` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`orderID`, `paymentStatus`, `orderStatus`, `timestamp`, `total`, `Payment_paymentID`, `Customer_customerID1`) VALUES
('ch_1BpEH9JSrjSwHytkcY9j1W8r', 'paid', 'delivered', '2018-01-28 19:24:45', 14, 'ch_1BpEH9JSrjSwHytkcY9j1W8r', 'rkPM4biSM');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentID` varchar(20) NOT NULL,
  `cardHolderName` varchar(45) DEFAULT NULL,
  `paymentType` varchar(45) DEFAULT NULL,
  `cardNumber` varchar(16) DEFAULT NULL,
  `exipirationDate` date DEFAULT NULL,
  `securityCode` varchar(4) DEFAULT NULL,
  `cardType` varchar(45) DEFAULT NULL,
  `Customer_customerID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewID` varchar(20) NOT NULL,
  `rating` varchar(45) DEFAULT NULL,
  `reviewComments` varchar(200) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(45) DEFAULT NULL,
  `Customer_customerID` varchar(20) NOT NULL,
  `FoodItem_foodItemID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`reviewID`, `rating`, `reviewComments`, `timestamp`, `image`, `Customer_customerID`, `FoodItem_foodItemID`) VALUES
('rJ7lwrJUz', '4', 'awesome', '2018-01-31 21:38:50', '', 'rkPM4biSM', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customerID`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- Indexes for table `fooditem`
--
ALTER TABLE `fooditem`
  ADD PRIMARY KEY (`foodItemID`);

--
-- Indexes for table `fooditemorder`
--
ALTER TABLE `fooditemorder`
  ADD PRIMARY KEY (`FoodItem_foodItemID`,`Order_orderID`),
  ADD KEY `fk_FoodItemOrder_FoodItem1_idx` (`FoodItem_foodItemID`),
  ADD KEY `fk_FoodItemOrder_Order1_idx` (`Order_orderID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderID`,`Customer_customerID1`) USING BTREE,
  ADD KEY `fk_Order_Customer1_idx` (`Customer_customerID1`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentID`,`Customer_customerID`),
  ADD KEY `fk_Payment_Customer1_idx` (`Customer_customerID`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewID`,`Customer_customerID`,`FoodItem_foodItemID`),
  ADD KEY `fk_Review_Customer1_idx` (`Customer_customerID`),
  ADD KEY `fk_Review_FoodItem1_idx` (`FoodItem_foodItemID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fooditemorder`
--
ALTER TABLE `fooditemorder`
  ADD CONSTRAINT `fk_FoodItemOrder_FoodItem1` FOREIGN KEY (`FoodItem_foodItemID`) REFERENCES `fooditem` (`foodItemID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_FoodItemOrder_Order1` FOREIGN KEY (`Order_orderID`) REFERENCES `order` (`orderID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_Order_Customer1` FOREIGN KEY (`Customer_customerID1`) REFERENCES `customer` (`customerID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_Payment_Customer1` FOREIGN KEY (`Customer_customerID`) REFERENCES `customer` (`customerID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `fk_Review_Customer1` FOREIGN KEY (`Customer_customerID`) REFERENCES `customer` (`customerID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Review_FoodItem1` FOREIGN KEY (`FoodItem_foodItemID`) REFERENCES `fooditem` (`foodItemID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
