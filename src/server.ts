import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { publishDuePosts } from "./services/publisher.service.js";
import { startPublishWorker } from "./workers/publish.worker.js";

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    startPublishWorker();
    const recovered = await publishDuePosts(); 
    if (recovered > 0) console.log(`Recovered ${recovered} overdue post(s)`);

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
