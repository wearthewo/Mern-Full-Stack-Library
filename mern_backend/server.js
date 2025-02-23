import express from "express";
import morgan from "morgan";
import libraryRoutes from "./routes/libraryRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use("/api", libraryRoutes);
app.use("/api/users", userRoutes); // User authentication routes
/* app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({ success: true, data: req.body });
}); */

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is listening on port ${process.env.port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
