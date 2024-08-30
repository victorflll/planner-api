/*
  Warnings:

  - A unique constraint covering the columns `[trip_id,title,date]` on the table `activities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trip_id,link]` on the table `attachments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trip_id,email]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "activities_trip_id_title_date_key" ON "activities"("trip_id", "title", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_trip_id_link_key" ON "attachments"("trip_id", "link");

-- CreateIndex
CREATE UNIQUE INDEX "members_trip_id_email_key" ON "members"("trip_id", "email");
