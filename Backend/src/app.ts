import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

import adminRoutes from "./routes/admin.routes";

app.use("/api/v1/admin", adminRoutes);

export default app;
