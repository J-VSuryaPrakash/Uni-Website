import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

import adminRoutes from "./routes/admin.routes";

app.use("/api/v1/admin", adminRoutes);

export default app;
