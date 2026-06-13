import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../../models/response";
import z from "zod";
import { signUpSchema } from "./auth.schema";
import {
  createAccountService,
  getUserPointsService,
  getUserService,
  loginAccountService,
  getQoinTransactionsService,
  redeemQoinService,
  topUpBalanceService,
  updateProfileService,
} from "./auth.service";
import setAuthToken from "../../shared/setAuthToken";
import { AuthRequest } from "../../middleware/verifyToken";

export const createAccount = async (
  req: Request,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as z.infer<typeof signUpSchema>;
    console.log(`Email: ${email}, Password: ${password}`);
    const user = await createAccountService(email, password);

    return res.status(201).json({
      message: "Account created successfully",
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const loginAccount = async (
  req: Request,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt - Email: ${email}, Password: ${password}`);
    const user = await loginAccountService(email, password);

    setAuthToken(user.id, res);

    return res.status(200).json({
      message: "Login successful",
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id as string;
    const user = await getUserService(userId);

    return res.status(200).json({
      message: "User retrieved successfully",
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutAccount = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    // clear cookie harus pakai opsi yang sama dengan saat setAuthToken
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
      status: "success",
    });
  } catch (err) {
    next(err);
    console.error(err);
  }
};

/**
 * GET /api/auth/socket-token
 * Mengembalikan JWT token dari httpOnly cookie agar bisa digunakan
 * oleh Socket.IO client sebagai auth.token di handshake.
 * Endpoint ini aman karena hanya bisa diakses oleh user yang sudah
 * terautentikasi (dilindungi oleh middleware verifyToken).
 */
export const getSocketToken = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token as string;
    return res.status(200).json({
      status: "success",
      message: "Socket token retrieved",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPoints = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const points = await getUserPointsService(user_id);
    return res.status(200).json({
      message: "User points retrieved successfully",
      status: "success",
      data: points,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getQoinTransactions = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const transactions = await getQoinTransactionsService(user_id);
    return res.status(200).json({
      status: "success",
      message: "Qoin transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("[auth.getQoinTransactions] error:", err);
    next(err);
  }
};

export const redeemQoin = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { amount } = req.body as { amount: number };

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Jumlah penukaran tidak valid",
      });
    }

    const result = await redeemQoinService(user_id, Number(amount));
    return res.status(200).json({
      status: "success",
      message: `Berhasil menukar ${amount} Qoin`,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menukar Qoin";
    if (message.includes("tidak mencukupi")) {
      return res.status(400).json({ status: "error", message });
    }
    next(err);
  }
};

export const topUpBalance = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { amount } = req.body as { amount: number };

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Jumlah top-up tidak valid",
      });
    }

    const result = await topUpBalanceService(user_id, Number(amount));
    return res.status(200).json({
      status: "success",
      message: `Berhasil melakukan top-up sebesar Rp ${Number(amount).toLocaleString("id-ID")}`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { name, phone, address, profile_photo } = req.body;

    const updatedUser = await updateProfileService(user_id, {
      name,
      phone,
      address,
      profile_photo,
    });

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
