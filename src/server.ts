import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";
import { publishDuePosts } from "./services/publisher.service.js";


const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}
try{
mongoose.connect(MONGO_URI).then(() =>{
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    const run = async () => {
      try {
        const count = await publishDuePosts();
        if (count > 0) console.log(`Published ${count} post(s)`);
      } catch (err) {
        console.error("Publisher failed:", err);
      }
    };

    run();
    setInterval(run, 30_000);
  });
})
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}
