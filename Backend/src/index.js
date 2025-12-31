import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./db/index.js";

dotenv.config({ path: "../.env" });

app.on("error", (error) => {
    console.log("Express server error: ", error)
    process.exit(1)
});

connectDB()
  .then(() => {
    sequelize.sync({ alter: true }) 
      .then(() => {
        app.listen(process.env.PORT || 8000, () => {
          console.log(`Server running on port ${process.env.PORT}`);
        });
      });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });