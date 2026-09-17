CREATE TABLE `veterinaryAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` int,
	`petName` varchar(120) NOT NULL,
	`serviceType` enum('deworm','anti-rabies','checkup','full-checkup') NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `veterinaryAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `veterinaryAppointments` ADD CONSTRAINT `veterinaryAppointments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `veterinaryAppointments` ADD CONSTRAINT `veterinaryAppointments_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE no action ON UPDATE no action;