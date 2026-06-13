"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStockRatingService = exports.getSelledStocksByPaymentIdService = exports.updateOrderStatusService = exports.getUserTransactionsService = exports.selledStockService = exports.deleteManyStocksService = exports.deleteStocksService = exports.updateStocksService = exports.getStocksByMerchantIdService = exports.addStocksService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const addStocksService = async (name, quantity, price, photo_url, merchant_id, description, user_id) => {
    const stocks = await prisma_1.default.stocks.create({
        data: {
            name,
            quantity: Number(quantity),
            photo_url,
            merchant_id,
            user_id,
            price: Number(price),
            description,
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
        include: {
            stockRating: true,
        },
    });
    return stocks;
};
exports.getStocksByMerchantIdService = getStocksByMerchantIdService;
const updateStocksService = async (stock_id, data) => {
    const stocks = await prisma_1.default.stocks.update({
        where: {
            id: stock_id,
        },
        data,
    });
    return stocks;
};
exports.updateStocksService = updateStocksService;
const deleteStocksService = async (stock_id) => {
    const stocks = await prisma_1.default.stocks.delete({
        where: {
            id: stock_id,
        },
    });
    return stocks;
};
exports.deleteStocksService = deleteStocksService;
const deleteManyStocksService = async (stock_ids) => {
    const deleted = await prisma_1.default.stocks.deleteMany({
        where: {
            id: {
                in: stock_ids,
            },
        },
    });
    return deleted;
};
exports.deleteManyStocksService = deleteManyStocksService;
const selledStockService = async ({ paymentId, userId, items, paymentMethod, amountToDeduct, }) => {
    if (!Array.isArray(items) || items.length === 0) {
        return {
            count: 0,
        };
    }
    const fixedPoints = 150;
    const payload = items.map((item) => ({
        payment_id: paymentId,
        user_id: userId,
        stock_id: item.id,
        quantity: item.quantity,
        merchant_id: item.merchant_id,
        total_price: item.quantity * item.price,
    }));
    const result = await prisma_1.default.$transaction(async (tx) => {
        // Jika metode pembayaran menggunakan Saldo, lakukan pengecekan dan pengurangan saldo
        if (paymentMethod === "saldo" && amountToDeduct !== undefined) {
            if (amountToDeduct < 0) {
                throw new Error("Nominal pembayaran tidak valid");
            }
            const user = await tx.users.findUnique({
                where: { id: userId },
                select: { balance: true },
            });
            if (!user) {
                throw new Error("User tidak ditemukan");
            }
            if (user.balance < amountToDeduct) {
                throw new Error(`Saldo tidak mencukupi. Saldo Anda: Rp ${user.balance.toLocaleString("id-ID")}, Total Bayar: Rp ${amountToDeduct.toLocaleString("id-ID")}`);
            }
            // Potong saldo user
            await tx.users.update({
                where: { id: userId },
                data: {
                    balance: {
                        decrement: amountToDeduct,
                    },
                },
            });
        }
        // 1. Catat data stok yang terjual
        const created = await tx.selled_stocks.createMany({
            data: payload,
        });
        // 2. Kurangi kuantitas stok masing-masing barang secara async (HOF: items.map + Promise.all)
        await Promise.all(items.map(async (item) => {
            const currentStock = await tx.stocks.findUnique({
                where: { id: item.id },
            });
            if (!currentStock || currentStock.quantity < item.quantity) {
                throw new Error(`Kuantitas stok tidak mencukupi untuk barang: ${currentStock?.name || item.id}`);
            }
            await tx.stocks.update({
                where: { id: item.id },
                data: {
                    quantity: {
                        decrement: item.quantity,
                    },
                },
            });
        }));
        // 3. Catat riwayat perolehan poin baru
        await tx.points.create({
            data: {
                user_id: userId,
                amount: fixedPoints,
                expires_in: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        // 4. Sinkronisasikan total poin user di tabel users
        await tx.users.update({
            where: { id: userId },
            data: {
                total_point: {
                    increment: fixedPoints,
                },
            },
        });
        return created;
    });
    return result;
};
exports.selledStockService = selledStockService;
const getUserTransactionsService = async (userId) => {
    const transactions = await prisma_1.default.selled_stocks.findMany({
        where: {
            user_id: userId,
        },
        include: {
            merchant: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return transactions;
};
exports.getUserTransactionsService = getUserTransactionsService;
const updateOrderStatusService = async (paymentId, status) => {
    const updated = await prisma_1.default.selled_stocks.updateMany({
        where: {
            payment_id: paymentId,
        },
        data: {
            status,
        },
    });
    return updated;
};
exports.updateOrderStatusService = updateOrderStatusService;
const getSelledStocksByPaymentIdService = async (paymentId) => {
    const transactions = await prisma_1.default.selled_stocks.findMany({
        where: {
            payment_id: paymentId,
        },
        include: {
            merchant: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
    });
    return transactions;
};
exports.getSelledStocksByPaymentIdService = getSelledStocksByPaymentIdService;
const addStockRatingService = async (stock_id, rate) => {
    const rating = await prisma_1.default.stock_rating.create({
        data: {
            stock_id,
            rate: Number(rate),
        },
    });
    return rating;
};
exports.addStockRatingService = addStockRatingService;
