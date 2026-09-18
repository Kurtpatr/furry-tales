CREATE TABLE `groomingAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` int,
	`petName` varchar(120) NOT NULL,
	`serviceType` enum('bath-blow-dry','full-groom','haircut-trim','nail-trim') NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groomingAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `groomingAppointments` ADD CONSTRAINT `groomingAppointments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groomingAppointments` ADD CONSTRAINT `groomingAppointments_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE no action ON UPDATE no action;