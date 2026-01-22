import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import menuRoutes from "./modules/menu/menu.route";
import publicMenuRoutes from "./modules/menu/menu.route";
import adminRoutes from "./routes/admin.routes";
import pageRoutes from "./modules/pages/page.route";
import publicPageRoutes from "./modules/pages/page.route";
import designationRoutes from "./modules/designation/designation.route";
import pageSectionRoutes from "./modules/pageSections/pageSections.route";
import departmentRoutes from "./modules/department/department.route";
import contentBlockRoutes from "./modules/ContentBlocks/constentBlocks.route";
import directorateRoutes from "./modules/directorate/directorate.router";
import pageDirectorateRoutes from "./modules/pageDirectorates/pageDirectorates.route";
import notificationRoutes from "./modules/notification/notification.route";
import notificationAttachmentRoutes from "./modules/notificationAttachments/notifyAttachment.route";
import publicNotificationAttachmentRoutes from "./modules/notificationAttachments/notifyAttachment.route";
import eventCategory from "./modules/eventCategory/eventCategory.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(errorMiddleware);


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/menus", menuRoutes);
app.use("/api/v1/menus", publicMenuRoutes);
app.use("/api/v1/admin/pages", pageRoutes);
app.use("/api/v1/pages", publicPageRoutes);
app.use("/api/v1/admin/designations", designationRoutes);
app.use("/api/v1/admin/", pageSectionRoutes);
app.use("/api/v1/admin/departments", departmentRoutes);
app.use("/api/v1/admin", contentBlockRoutes);
app.use("/api/v1/admin/directorates", directorateRoutes);
app.use("/api/v1/admin/page-directorates", pageDirectorateRoutes);
app.use("/api/v1/admin/notifications", notificationRoutes);
app.use("/api/v1/admin/notification-attachments", notificationAttachmentRoutes);
app.use("/api/v1/notification-attachments", publicNotificationAttachmentRoutes);
app.use("/api/v1/admin/event-categories", eventCategory);
app.use("/api/v1/event-categories", eventCategory);

export default app;
