import { Router } from "express";
import multer from "multer";
import {
  addStocks,
  getStocksByMerchantId,
  deleteStocks,
  changeDisplayStocks,
  updateStocks,
  deleteManyStocks,
  selledStock,
  getUserTransactions,
} from "./stocks.controller";
import { verifyToken } from "../../middleware/verifyToken";
import { validate } from "../../middleware/validate";
import {
  addStocksSchema,
  updateStocksSchema,
  deleteManyStocksSchema,
} from "./stocks.schema";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", verifyToken);
router.get("/:merchant_id", verifyToken, getStocksByMerchantId);

router.post(
  "/add/:merchant_id",
  verifyToken,
  upload.fields([{ name: "product_photo", maxCount: 1 }]),
  validate(addStocksSchema, "body"),
  addStocks
);

router.patch(
  "/:stock_id",
  verifyToken,
  validate(updateStocksSchema, "body"),
  updateStocks
);

router.delete("/:stock_id", verifyToken, deleteStocks);

router.delete(
  "/",
  verifyToken,
  validate(deleteManyStocksSchema, "body"),
  deleteManyStocks
);

router.patch("/change-display", verifyToken, changeDisplayStocks);

// INI GANTI NANTI DI E DPOINT TRANSACTION
router.post("/selled-stock/:payment_id", verifyToken, selledStock);
router.get("/user/transactions", verifyToken, getUserTransactions);

export default router;
