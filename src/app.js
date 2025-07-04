import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import dotenv from "dotenv";
import { errorMiddleware } from "./utils/ApiError.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //for static files
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.send("pong");
});
import userRoute from "./routes/user.route.js";
import restaurantRoute from "./routes/restaturant.route.js";
import categoryRoute from "./routes/category.route.js";
import foodRoute from "./routes/food.route.js";
import orderRoute from "./routes/order.route.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/foods", foodRoute);
app.use("/api/v1/orders", orderRoute);

app.use(errorMiddleware);
export default app;
