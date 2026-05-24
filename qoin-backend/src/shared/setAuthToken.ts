import jwt from "jsonwebtoken";
import { Response } from "express";

const setAuthToken = (userId: string, res: Response) => {
  const token = jwt.sign(
    { user_id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // hanya secure di production
    sameSite: isProd ? "none" : "lax", // lax di development agar browser mau menerima cookie httpOnly lokal tanpa https
    path: "/",
  });
};

export default setAuthToken;
