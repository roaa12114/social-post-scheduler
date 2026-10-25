import express from "express";
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorhandling.js';
import postRoutes from "./routes/post.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

app.use(express.json());
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes); 

app.use(errorHandler);

export default app;
