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


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(errorMiddleware);


// app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/menus", menuRoutes);
app.use("/api/v1/menus", publicMenuRoutes);
app.use("/api/v1/admin/pages", pageRoutes);
app.use("/api/v1/pages", publicPageRoutes);
app.use("/api/v1/admin/designations", designationRoutes);
app.use("/api/v1/admin/", pageSectionRoutes);

export default app;
