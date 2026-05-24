import { NextFunction, Response } from "express";
import { APIResponse } from "../../models/response";
import {
  addStocksService,
  getStocksByMerchantIdService,
  deleteStocksService,
  updateStocksService,
  deleteManyStocksService,
  selledStockService,
  getUserTransactionsService,
} from "./stocks.service";
import { AuthRequest } from "../../middleware/verifyToken";
import z from "zod";
import {
  addStocksSchema,
  updateStocksSchema,
  deleteManyStocksSchema,
} from "./stocks.schema";
import { uploadToSupabase } from "../../shared/uploadToSupabase";

export const addStocks = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { merchant_id } = req.params;
    const user_id = req.user?.user_id as string;
    const { name, quantity, price, description } = req.body as z.infer<
      typeof addStocksSchema
    >;

    const files =
      (req.files as {
        [field: string]: Express.Multer.File[];
      }) || null;

    let photoUrl = "";

    // Frontend sends the file under key `product_photo`. Support fallback to `photo_url`.
    const file = files?.product_photo?.[0] || files?.photo_url?.[0];
    if (file) {
      console.log("[stocks.add] using uploaded photo");
      const uploaded = await uploadToSupabase(file, "stocks");
      photoUrl = uploaded.url;
    }

    const stocks = await addStocksService(
      name,
      quantity,
      price,
      photoUrl,
      merchant_id,
      description,
      user_id
    );

    return res.status(201).json({
      message: "Stocks added successfully",
      status: "success",
      data: stocks,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getStocksByMerchantId = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  const { merchant_id } = req.params;
  const stocks = await getStocksByMerchantIdService(merchant_id);
  return res.status(200).json({
    message: "Stocks retrieved successfully",
    status: "success",
    data: stocks,
  });
};

export const updateStocks = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { stock_id } = req.params;
    const body = req.body as z.infer<typeof updateStocksSchema>;
    const payload: {
      name?: string;
      quantity?: number;
      price?: number;
      description?: string;
      is_displayed?: boolean;
    } = {};

    if (body.name !== undefined) payload.name = body.name;
    if (body.quantity !== undefined) payload.quantity = body.quantity;
    if (body.price !== undefined) payload.price = body.price;
    if (body.description !== undefined) payload.description = body.description;
    if (body.is_displayed !== undefined)
      payload.is_displayed = body.is_displayed;

    const stocks = await updateStocksService(stock_id, payload);

    return res.status(200).json({
      message: "Stocks updated successfully",
      status: "success",
      data: stocks,
    });
  } catch (err) {
    next(err);
  }
};

export const changeDisplayStocks = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { stock_id, is_displayed } = req.body as {
      stock_id: string;
      is_displayed: boolean;
    };

    const stocks = await updateStocksService(stock_id, { is_displayed });

    return res.status(200).json({
      message: "Stocks display status updated successfully",
      status: "success",
      data: stocks,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStocks = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { stock_id } = req.params;
    const stocks = await deleteStocksService(stock_id);

    return res.status(200).json({
      message: "Stocks deleted successfully",
      status: "success",
      data: stocks,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteManyStocks = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { stock_ids } = req.body as z.infer<typeof deleteManyStocksSchema>;
    const result = await deleteManyStocksService(stock_ids);

    return res.status(200).json({
      message: "Stocks deleted successfully",
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

type SelledStockItem = {
  id: string;
  quantity: number;
  price: number;
  merchant_id: string;
};

export const selledStock = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { payment_id } = req.params;
    const { user_id } = req.user as { user_id: string };
    const { items } = req.body as { items: SelledStockItem[] };

    if (!payment_id) {
      return res.status(400).json({
        status: "error",
        message: "payment_id is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "items cannot be empty",
      });
    }

    // logging buat debug
    // for (const item of items) {
    //   console.log(
    //     `payment_id: ${payment_id}, user_id: ${user_id}, stock_id: ${item.id}, quantity: ${item.quantity}, price: ${item.price}, merchant_id: ${item.merchant_id}`
    //   );
    // }

    const result = await selledStockService({
      paymentId: payment_id,
      userId: user_id,
      items,
    });

    return res.status(201).json({
      status: "success",
      message: "Successfully created selled stocks",
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserTransactions = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const transactions = await getUserTransactionsService(user_id);

    return res.status(200).json({
      status: "success",
      message: "User transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
