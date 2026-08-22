/*
  Warnings:

  - A unique constraint covering the columns `[user_id,meeting_id]` on the table `MeetingParticipants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `meetingparticipants` DROP FOREIGN KEY `MeetingParticipants_meeting_id_fkey`;

-- DropForeignKey
ALTER TABLE `meetingparticipants` DROP FOREIGN KEY `MeetingParticipants_user_id_fkey`;

-- DropIndex
DROP INDEX `MeetingParticipants_meeting_id_fkey` ON `meetingparticipants`;

-- DropIndex
DROP INDEX `MeetingParticipants_user_id_fkey` ON `meetingparticipants`;

-- AlterTable
ALTER TABLE `meetingparticipants` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `MeetingParticipants_user_id_meeting_id_key` ON `MeetingParticipants`(`user_id`, `meeting_id`);

-- AddForeignKey
ALTER TABLE `MeetingParticipants` ADD CONSTRAINT `MeetingParticipants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MeetingParticipants` ADD CONSTRAINT `MeetingParticipants_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `Meeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
