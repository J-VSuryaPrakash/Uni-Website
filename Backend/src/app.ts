import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";

// ============================
// Route Imports
// ============================

// Admin Authentication Routes
import adminRoutes from "./modules/admin/admin.route";

// Menu Routes (Admin & Public)
import {
	default as menuRoutes,
	default as publicMenuRoutes,
} from "./modules/menu/menu.route";

// Page Management Routes (Admin & Public)
import contentBlockRoutes from "./modules/contentBlocks/contentBlocks.route";
import {
	default as pageRoutes,
	default as publicPageRoutes,
} from "./modules/pages/page.route";
import pageSectionRoutes from "./modules/pageSections/pageSections.route";

// Organization Structure Routes
import departmentRoutes from "./modules/department/department.route";
import designationRoutes from "./modules/designation/designation.route";
import directorateRoutes from "./modules/directorate/directorate.router";
import pageDirectorateRoutes from "./modules/pageDirectorates/pageDirectorates.route";

// Notification Routes (Admin & Public)
import notificationRoutes from "./modules/notification/notification.route";
import {
	default as notificationAttachmentRoutes,
	default as publicNotificationAttachmentRoutes,
} from "./modules/notificationAttachments/notifyAttachment.route";

// Event Management Routes (Admin & Public)
import {
	default as eventRoutes,
	default as publicEventRoutes,
} from "./modules/event/event.route";
import {
	default as eventCategory,
	default as publicEventCategory,
} from "./modules/eventCategory/eventCategory.route";

// Media Management Routes
import eventMediaRoutes from "./modules/eventMedia/eventMedia.route";
import mediaRoutes from "./modules/media/media.route";

// ============================
// App Initialization
// ============================
const app = express();

// ============================
// Middleware Configuration
// ============================
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from request headers
app.use(helmet()); // Security headers middleware
app.use(errorMiddleware); // Global error handling middleware

// ============================
// API Routes - Version 1
// ============================

// --------------------------------------------------
// Authentication Routes
// Handles admin login, logout, and session management
// --------------------------------------------------
app.use("/api/v1/admin", adminRoutes);

// --------------------------------------------------
// Menu Routes
// Admin: CRUD operations for navigation menus
// Public: Read-only access to published menus
// --------------------------------------------------
app.use("/api/v1/admin/menus", menuRoutes);
app.use("/api/v1/menus", publicMenuRoutes);

// --------------------------------------------------
// Page Management Routes
// Admin: Create, update, delete pages and their content
// Public: Read-only access to published pages
// --------------------------------------------------
app.use("/api/v1/admin/pages", pageRoutes);
app.use("/api/v1/pages", publicPageRoutes);
app.use("/api/v1/admin/", pageSectionRoutes); // Page sections (nested under pages)
app.use("/api/v1/admin", contentBlockRoutes); // Content blocks within sections

// --------------------------------------------------
// Organization Structure Routes
// Manage designations, departments, and directorates
// --------------------------------------------------
app.use("/api/v1/admin/designations", designationRoutes);
app.use("/api/v1/admin/departments", departmentRoutes);
app.use("/api/v1/admin/directorates", directorateRoutes);
app.use("/api/v1/admin/page-directorates", pageDirectorateRoutes);

// --------------------------------------------------
// Notification Routes
// Admin: Manage notifications and their attachments
// Public: Read-only access to notification attachments
// --------------------------------------------------
app.use("/api/v1/admin/notifications", notificationRoutes);
app.use("/api/v1/admin/notification-attachments", notificationAttachmentRoutes);
app.use("/api/v1/notification-attachments", publicNotificationAttachmentRoutes);

// --------------------------------------------------
// Event Management Routes
// Admin: Manage events and event categories
// Public: Read-only access to events and categories
// --------------------------------------------------
app.use("/api/v1/admin/event-categories", eventCategory);
app.use("/api/v1/event-categories", publicEventCategory);
app.use("/api/v1/admin/events", eventRoutes);
app.use("/api/v1/events", publicEventRoutes);

// --------------------------------------------------
// Media Management Routes
// Admin: Upload and manage media files (images, documents)
// --------------------------------------------------
app.use("/api/v1/admin/media", mediaRoutes);
app.use("/api/v1/admin/event-media", eventMediaRoutes);

export default app;
