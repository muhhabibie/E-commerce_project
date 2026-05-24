"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStocks = exports.getStocksByMerchantId = exports.addStocks = void 0;
const stocks_service_1 = require("./stocks.service");
const uploadToSupabase_1 = require("../../shared/uploadToSupabase");
const addStocks = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const user_id = req.user?.user_id;
        const { name, quantity, price } = req.body;
        console.log(name, quantity, price);
        const files = req.files || null;
        let photoUrl = "";
        // Frontend sends the file under key `product_photo`. Support fallback to `photo_url`.
        const file = files?.product_photo?.[0] || files?.photo_url?.[0];
        if (file) {
            console.log("[stocks.add] using uploaded photo");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(file, "stocks");
            photoUrl = uploaded.url;
        }
        const stocks = await (0, stocks_service_1.addStocksService)(name, quantity, price, photoUrl, merchant_id, user_id);
        return res.status(201).json({
            message: "Stocks added successfully",
            status: "success",
            data: stocks,
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.addStocks = addStocks;
const getStocksByMerchantId = async (req, res, next) => {
    const { merchant_id } = req.params;
    const stocks = await (0, stocks_service_1.getStocksByMerchantIdService)(merchant_id);
    return res.status(200).json({
        message: "Stocks retrieved successfully",
        status: "success",
        data: stocks,
    });
};
exports.getStocksByMerchantId = getStocksByMerchantId;
const updateStocks = async (req, res, next) => {
    try {
        const { stock_id } = req.params;
        const { quantity } = req.body;
        console.log("Updating stock:", stock_id, "with quantity:", quantity);
        const stocks = await (0, stocks_service_1.updateStocksService)(stock_id, quantity);
        return res.status(200).json({
            message: "Stocks updated successfully",
            status: "success",
            data: stocks,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateStocks = updateStocks;
