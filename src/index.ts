import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api";
import dotenv from "dotenv";
import db from "./utils/database";

dotenv.config();

async function init() {
  try {
    const result = await db.connect();
    console.log("Database status : " + result);

    const PORT = process.env.PORT || 3000;
    const app = express();

    app.use(bodyParser.json());

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

init();