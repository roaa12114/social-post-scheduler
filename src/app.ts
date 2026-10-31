import express from "express";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorhandling.js";
import postRoutes from "./routes/post.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Too many requests, try again later" } },
});

app.use(helmet());
app.use(cors());

app.use(express.json());
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authLimiter, authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

app.use(errorHandler);

export default app;
