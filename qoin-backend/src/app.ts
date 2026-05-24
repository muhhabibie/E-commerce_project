import express from "express";
import authRouter from "./features/auth/auth.route";
import merchantRouter from "./features/merchant/merchant.route";
import stocksRouter from "./features/stocks/stocks.route";
import chatRouter from "./features/chat/chat.route";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

import addressRoute from "./features/address/address.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://qoin-frontend.vercel.app",
      "https://qoin-frontend-main.vercel.app",
      "https://qoin-in-main.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/stocks", stocksRouter);
app.use("/api/chat", chatRouter);
app.use("/api/addresses", addressRoute);
// MIDDLEWARE HANDLING ERROR
app.use(errorHandler);

export default app;
