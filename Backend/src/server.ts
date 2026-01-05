import app from "./app";
import dotenv from "dotenv";
import prisma from "../lib/prisma";

dotenv.config();

const PORT = process.env.PORT || 4000;

const connnectDB = async () => {
	try {
		await prisma.$connect();
		console.log("Database connected successfully");
		
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1);
	}
};

connnectDB();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
