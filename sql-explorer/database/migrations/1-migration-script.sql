ALTER TABLE `shops`
	CHANGE COLUMN `address` `address` VARCHAR(500) NOT NULL COLLATE 'utf8mb3_general_ci' AFTER `id`;
