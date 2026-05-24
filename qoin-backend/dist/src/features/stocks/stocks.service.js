"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStocksService = exports.getStocksByMerchantIdService = exports.addStocksService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const addStocksService = async (name, quantity, price, photo_url, merchant_id, user_id) => {
    const stocks = await prisma_1.default.stocks.create({
        data: {
            name,
            quantity: Number(quantity),
            photo_url,
            merchant_id,
            user_id,
            price: Number(price),
        },
    });
    return stocks;
};
exports.addStocksService = addStocksService;
const getStocksByMerchantIdService = async (merchant_id) => {
    const stocks = await prisma_1.default.stocks.findMany({
        where: {
            merchant_id,
        },
    });
    return stocks;
};
exports.getStocksByMerchantIdService = getStocksByMerchantIdService;
const updateStocksService = async (stock_id, quantity) => {
    const stocks = await prisma_1.default.stocks.update({
        where: {
            id: stock_id,
        },
        data: {
            quantity,
        },
    });
    return stocks;
};
exports.updateStocksService = updateStocksService;
