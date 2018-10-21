//Create users table

CREATE TABLE `users` ( `id` int(11) NOT NULL, `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL, `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL, `cellNumber` varchar(20) COLLATE utf8_unicode_ci NOT NULL, `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL, `roleId` int(11) NOT NULL, `companyId` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

//Add primary key

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

//auto inceremt

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;COMMIT;


ALTER TABLE users ADD UNIQUE (email)


//create table roles

CREATE TABLE `roles` ( `id` int(11) NOT NULL, `value` varchar(20) COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

ALTER TABLE `roles` ADD PRIMARY KEY (`id`)

ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `roles` (`id`, `value`) VALUES (NULL, 'Admin'), (NULL, 'AdminEmpl'), (NULL, 'User')


//create table company

CREATE TABLE `company` ( `id` int(11) NOT NULL, `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `company` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1


//Create table truck types

CREATE TABLE `truckType` ( `id` int(11) NOT NULL, `description` varchar(100) COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

ALTER TABLE `truckType` ADD PRIMARY KEY (`id`)

ALTER TABLE `truckType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

//Create table trucks

CREATE TABLE `trucks` ( `id` int(11) NOT NULL, `description` varchar(100) NOT NULL,`truckTypeId` int(11) NOT NULL, `companyId` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

ALTER TABLE `trucks` ADD PRIMARY KEY (`id`)

ALTER TABLE `trucks` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1



START TRANSACTION; SELECT company.id AS ID FROM company WHERE company.companyCode = 'ABC'; INSERT INTO friends (id, companyId1, companyId2) SELECT companyCode, 5, ID FROM company WHERE companyCode = 'AB'; INSERT INTO friends (id, companyId1, companyId2) SELECT companyCode, ID, 5 FROM company WHERE companyCode = 'AB'; COMMIT;

Create table tenders

CREATE TABLE `tenders` ( `id` int(11) NOT NULL, `description` varchar(150) COLLATE utf8_unicode_ci NOT NULL, `start` varchar(100) COLLATE utf8_unicode_ci NOT NULL, `destinantion` varchar(100) COLLATE utf8_unicode_ci NOT NULL, `startDate` DateTime COLLATE utf8_unicode_ci NOT NULL, `expiryDate` DateTime NOT NULL, `companyId` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci