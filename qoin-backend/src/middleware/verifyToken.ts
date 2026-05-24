import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";

export type AuthRequest = Request & {
  user?: { user_id: string; iat?: number; exp?: number };
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { user_id, iat, exp } = decoded as jwt.JwtPayload;
    // Ensure user exists (helps after DB resets during development)
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    req.user = { user_id, iat, exp };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};