import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import menuRoutes from "./modules/menu/menu.route";
import publicMenuRoutes from "./modules/menu/menu.route";
import adminRoutes from "./routes/admin.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(errorMiddleware);


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/menus", menuRoutes);
app.use("/api/v1/menus", publicMenuRoutes);

export default app;
