generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Menu {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  slug      String   @unique @db.VarChar(100)
  position  Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
  pages     Page[]
}

model Page {
  id           Int                @id @default(autoincrement())
  menuId       Int?
  parentId     Int?
  title        String             @db.VarChar(200)
  slug         String             @db.VarChar(200)
  position     Int
  status       String             @default("draft") @db.VarChar(20)
  seoMeta      Json?
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @default(now()) @updatedAt
  menu         Menu?              @relation(fields: [menuId], references: [id])
  parent       Page?              @relation("PageHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children     Page[]             @relation("PageHierarchy")
  directorates PageDirectorates[]
  sections     PageSection[]
}

model PageSection {
  id            Int            @id @default(autoincrement())
  pageId        Int
  title         String         @db.VarChar(200)
  position      Int
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @default(now()) @updatedAt
  contentBlocks ContentBlock[]
  page          Page           @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

model ContentBlock {
  id        Int         @id @default(autoincrement())
  sectionId Int
  blockType String      @db.VarChar(30)
  content   Json
  position  Int
  isVisible Boolean     @default(true)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @default(now()) @updatedAt
  section   PageSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
}

model Designation {
  id           Int           @id @default(autoincrement())
  title        String        @unique @db.VarChar(100)
  priority     Int
  directorates Directorate[]
}

model Department {
  id            Int            @id @default(autoincrement())
  name          String         @db.VarChar(200)
  directorates  Directorate[]
  notifications Notification[]
}

model Directorate {
  id               Int                @id @default(autoincrement())
  name             String             @db.VarChar(200)
  designationId    Int?
  departmentId     Int?
  photoUrl         String?
  profile          Json?
  isActive         Boolean            @default(true)
  department       Department?        @relation(fields: [departmentId], references: [id])
  designation      Designation?       @relation(fields: [designationId], references: [id])
  pageDirectorates PageDirectorates[]
}

model PageDirectorates {
  pageId        Int
  directorateId Int
  position      Int?
  directorate   Directorate @relation(fields: [directorateId], references: [id], onDelete: Cascade)
  page          Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@id([pageId, directorateId])
}

model Notification {
  id           Int                      @id @default(autoincrement())
  title        String                   @db.VarChar(300)
  category     String?                  @db.VarChar(50)
  departmentId Int?
  status       String                   @default("open") @db.VarChar(20)
  priority     Int                      @default(0)
  startsAt     DateTime?
  endsAt       DateTime?
  isScrolling  Boolean                  @default(false)
  isActive     Boolean                  @default(true)
  createdAt    DateTime                 @default(now())
  updatedAt    DateTime                 @default(now()) @updatedAt
  department   Department?              @relation(fields: [departmentId], references: [id])
  attachments  NotificationAttachment[]
}

model Media {
  id          Int                      @id @default(autoincrement())
  url         String
  type        String?                  @db.VarChar(30)
  createdAt   DateTime                 @default(now())
  updatedAt   DateTime                 @default(now()) @updatedAt
  attachments NotificationAttachment[]
  eventMedia  EventMedia[]
}

model Admin {
  id           Int    @id @default(autoincrement())
  name         String @db.VarChar(100)
  email        String @unique @db.VarChar(150)
  passwordHash String
}

model NotificationAttachment {
  id             Int          @id @default(autoincrement())
  notificationId Int
  title          String       @db.VarChar(300)
  mediaId        Int
  position       Int?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @default(now()) @updatedAt
  notification   Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  media          Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)
}

model EventCategory {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  slug      String   @unique @db.VarChar(100)
  position  Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  events Event[]

  @@index([isActive, position])
}

model Event {
  id          Int       @id @default(autoincrement())
  categoryId  Int
  title       String    @db.VarChar(200)
  description String?
  eventDate   DateTime?
  position    Int
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @default(now()) @updatedAt

  category EventCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  media    EventMedia[]

  @@index([categoryId, isActive, position])
  @@index([eventDate(sort: Desc)])
}

model EventMedia {
  id       Int     @id @default(autoincrement())
  eventId  Int
  mediaId  Int
  position Int?
  altText  String? @db.VarChar(150)
  event    Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  media    Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  @@index([eventId, position])
}
