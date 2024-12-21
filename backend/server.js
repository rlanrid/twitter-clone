import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth-route.js";
import userRoutes from "./routes/user-route.js";
import postRoutes from "./routes/post-route.js";
import notificationRoutes from "./routes/notification-route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" })); // req.body를 파싱하기위해서 사용
// 한계는 DOS 방어를 위해 너무 높아서는 안됨
app.use(express.urlencoded({ extended: true })); // form 데이터(urlencoded)를 파싱하기위해 사용

app.use(cookieParser());

// 라우트 사용
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});