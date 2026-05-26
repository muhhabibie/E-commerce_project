"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.orderStream = exports.broadcastOrderUpdate = exports.getUserTransactions = exports.selledStock = exports.deleteManyStocks = exports.deleteStocks = exports.changeDisplayStocks = exports.updateStocks = exports.getStocksByMerchantId = exports.addStocks = void 0;
const stocks_service_1 = require("./stocks.service");
const uploadToSupabase_1 = require("../../shared/uploadToSupabase");
const addStocks = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const user_id = req.user?.user_id;
        const { name, quantity, price, description } = req.body;
        const files = req.files || null;
        let photoUrl = "";
        // Frontend sends the file under key `product_photo`. Support fallback to `photo_url`.
        const file = files?.product_photo?.[0] || files?.photo_url?.[0];
        if (file) {
            console.log("[stocks.add] using uploaded photo");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(file, "stocks");
            photoUrl = uploaded.url;
        }
        const stocks = await (0, stocks_service_1.addStocksService)(name, quantity, price, photoUrl, merchant_id, description, user_id);
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
        const body = req.body;
        const payload = {};
        if (body.name !== undefined)
            payload.name = body.name;
        if (body.quantity !== undefined)
            payload.quantity = body.quantity;
        if (body.price !== undefined)
            payload.price = body.price;
        if (body.description !== undefined)
            payload.description = body.description;
        if (body.is_displayed !== undefined)
            payload.is_displayed = body.is_displayed;
        const stocks = await (0, stocks_service_1.updateStocksService)(stock_id, payload);
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
const changeDisplayStocks = async (req, res, next) => {
    try {
        const { stock_id, is_displayed } = req.body;
        const stocks = await (0, stocks_service_1.updateStocksService)(stock_id, { is_displayed });
        return res.status(200).json({
            message: "Stocks display status updated successfully",
            status: "success",
            data: stocks,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.changeDisplayStocks = changeDisplayStocks;
const deleteStocks = async (req, res, next) => {
    try {
        const { stock_id } = req.params;
        const stocks = await (0, stocks_service_1.deleteStocksService)(stock_id);
        return res.status(200).json({
            message: "Stocks deleted successfully",
            status: "success",
            data: stocks,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteStocks = deleteStocks;
const deleteManyStocks = async (req, res, next) => {
    try {
        const { stock_ids } = req.body;
        const result = await (0, stocks_service_1.deleteManyStocksService)(stock_ids);
        return res.status(200).json({
            message: "Stocks deleted successfully",
            status: "success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteManyStocks = deleteManyStocks;
const selledStock = async (req, res, next) => {
    try {
        const { payment_id } = req.params;
        const { user_id } = req.user;
        const { items, paymentMethod, amountToDeduct } = req.body;
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
        const result = await (0, stocks_service_1.selledStockService)({
            paymentId: payment_id,
            userId: user_id,
            items,
            paymentMethod,
            amountToDeduct: amountToDeduct ? Number(amountToDeduct) : undefined,
        });
        return res.status(201).json({
            status: "success",
            message: "Successfully created selled stocks",
            data: result,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.selledStock = selledStock;
const getUserTransactions = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const transactions = await (0, stocks_service_1.getUserTransactionsService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "User transactions retrieved successfully",
            data: transactions,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.getUserTransactions = getUserTransactions;
// Map to store active SSE clients per payment ID
const activeStreams = new Map();
// Broadcast updates to all active SSE streams of a payment ID
const broadcastOrderUpdate = (paymentId, status) => {
    const streams = activeStreams.get(paymentId);
    if (streams) {
        streams.forEach((res) => {
            res.write(`data: ${JSON.stringify({ status })}\n\n`);
        });
    }
};
exports.broadcastOrderUpdate = broadcastOrderUpdate;
// SSE order stream controller
const orderStream = async (req, res, next) => {
    try {
        const { payment_id } = req.params;
        // Set SSE headers
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        });
        res.write("\n");
        if (!activeStreams.has(payment_id)) {
            activeStreams.set(payment_id, []);
        }
        activeStreams.get(payment_id).push(res);
        // Fetch current status from database
        const existing = await (0, stocks_service_1.getSelledStocksByPaymentIdService)(payment_id);
        const currentStatus = existing[0]?.status || "pending";
        res.write(`data: ${JSON.stringify({ status: currentStatus })}\n\n`);
        // Automatic status simulation on the backend (pending -> processing -> on_shipping -> delivered)
        if (currentStatus === "pending") {
            setTimeout(async () => {
                try {
                    await (0, stocks_service_1.updateOrderStatusService)(payment_id, "processing");
                    (0, exports.broadcastOrderUpdate)(payment_id, "processing");
                    setTimeout(async () => {
                        try {
                            await (0, stocks_service_1.updateOrderStatusService)(payment_id, "on_shipping");
                            (0, exports.broadcastOrderUpdate)(payment_id, "on_shipping");
                            setTimeout(async () => {
                                try {
                                    await (0, stocks_service_1.updateOrderStatusService)(payment_id, "delivered");
                                    (0, exports.broadcastOrderUpdate)(payment_id, "delivered");
                                }
                                catch (err) {
                                    console.error("Error in delivered simulation:", err);
                                }
                            }, 10000); // 10s on_shipping to delivered
                        }
                        catch (err) {
                            console.error("Error in on_shipping simulation:", err);
                        }
                    }, 10000); // 10s processing to on_shipping
                }
                catch (err) {
                    console.error("Error in processing simulation:", err);
                }
            }, 5000); // 5s pending to processing
        }
        req.on("close", () => {
            const streams = activeStreams.get(payment_id);
            if (streams) {
                const idx = streams.indexOf(res);
                if (idx !== -1) {
                    streams.splice(idx, 1);
                }
                if (streams.length === 0) {
                    activeStreams.delete(payment_id);
                }
            }
        });
    }
    catch (err) {
        console.error("Error in SSE connection:", err);
        next(err);
    }
};
exports.orderStream = orderStream;
// Manual status update endpoint
const updateOrderStatus = async (req, res, next) => {
    try {
        const { payment_id } = req.params;
        const { status } = req.body;
        if (!payment_id) {
            return res.status(400).json({
                status: "error",
                message: "payment_id is required",
            });
        }
        if (!status) {
            return res.status(400).json({
                status: "error",
                message: "status is required",
            });
        }
        await (0, stocks_service_1.updateOrderStatusService)(payment_id, status);
        (0, exports.broadcastOrderUpdate)(payment_id, status);
        return res.status(200).json({
            status: "success",
            message: `Successfully updated order status to ${status}`,
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
exports.updateOrderStatus = updateOrderStatus;
