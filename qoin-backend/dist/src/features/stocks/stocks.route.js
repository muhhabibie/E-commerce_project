"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const stocks_controller_1 = require("./stocks.controller");
const verifyToken_1 = require("../../middleware/verifyToken");
const validate_1 = require("../../middleware/validate");
const stocks_schema_1 = require("./stocks.schema");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get("/", verifyToken_1.verifyToken);
router.get("/:merchant_id", verifyToken_1.verifyToken, stocks_controller_1.getStocksByMerchantId);
router.post("/add/:merchant_id", verifyToken_1.verifyToken, upload.fields([{ name: "product_photo", maxCount: 1 }]), (0, validate_1.validate)(stocks_schema_1.addStocksSchema, "body"), stocks_controller_1.addStocks);
router.patch("/:stock_id", verifyToken_1.verifyToken, (0, validate_1.validate)(stocks_schema_1.updateStocksSchema, "body"), stocks_controller_1.updateStocks);
router.delete("/:stock_id", verifyToken_1.verifyToken, stocks_controller_1.deleteStocks);
router.delete("/", verifyToken_1.verifyToken, (0, validate_1.validate)(stocks_schema_1.deleteManyStocksSchema, "body"), stocks_controller_1.deleteManyStocks);
router.patch("/change-display", verifyToken_1.verifyToken, stocks_controller_1.changeDisplayStocks);
// INI GANTI NANTI DI E DPOINT TRANSACTION
router.post("/selled-stock/:payment_id", verifyToken_1.verifyToken, stocks_controller_1.selledStock);
router.get("/user/transactions", verifyToken_1.verifyToken, stocks_controller_1.getUserTransactions);
// SSE and Order Status management
router.get("/order-stream/:payment_id", verifyToken_1.verifyToken, stocks_controller_1.orderStream);
router.patch("/orders/:payment_id/status", verifyToken_1.verifyToken, stocks_controller_1.updateOrderStatus);
exports.default = router;
