import { NextFunction, Response } from "express";
import { APIResponse } from "../../models/response";
import { AuthRequest } from "../../middleware/verifyToken";
import {
  getUserAddressesService,
  saveUserAddressService,
  getPrimaryAddressService,
} from "./address.service";

export const getUserAddresses = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id as string;
    const addresses = await getUserAddressesService(userId);

    return res.status(200).json({
      message: "Addresses retrieved successfully",
      status: "success",
      data: addresses,
    });
  } catch (err) {
    next(err);
  }
};

export const getPrimaryAddress = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id as string;
    const address = await getPrimaryAddressService(userId);

    return res.status(200).json({
      message: "Primary address retrieved successfully",
      status: "success",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const saveUserAddress = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const userId = req.user?.user_id as string;
    const { name, recipient, phone, address, is_primary } = req.body;

    const newAddress = await saveUserAddressService(userId, {
      name,
      recipient,
      phone,
      address,
      is_primary,
    });

    return res.status(201).json({
      message: "Address saved successfully",
      status: "success",
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
};
