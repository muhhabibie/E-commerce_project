"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileService = exports.topUpBalanceService = exports.redeemQoinService = exports.getQoinTransactionsService = exports.getUserPointsService = exports.getUserService = exports.loginAccountService = exports.createAccountService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const checkUser_1 = __importDefault(require("../../shared/checkUser"));
const comparePassword_1 = __importDefault(require("../../shared/comparePassword"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAccountService = async (email, password) => {
    const emailIsAvailable = await (0, checkUser_1.default)(email);
    if (emailIsAvailable) {
        throw new Error("Email is already in use");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.default.users.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    return user;
};
exports.createAccountService = createAccountService;
const loginAccountService = async (email, password) => {
    const user = await prisma_1.default.users.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await (0, comparePassword_1.default)(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    return user;
};
exports.loginAccountService = loginAccountService;
const getUserService = async (userId) => {
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserService = getUserService;
const getUserPointsService = async (userId) => {
    const points = await prisma_1.default.points.findMany({
        where: {
            user_id: userId,
        },
    });
    return points;
};
exports.getUserPointsService = getUserPointsService;
const getQoinTransactionsService = async (userId) => {
    const points = await prisma_1.default.points.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    const orders = await prisma_1.default.selled_stocks.findMany({
        where: {
            user_id: userId,
        },
        include: {
            merchant: {
                select: {
                    name: true,
                    type: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return points.map((point) => {
        const matchingOrder = orders.find((order) => Math.abs(new Date(order.created_at).getTime() - new Date(point.created_at).getTime()) < 10000);
        const merchantName = matchingOrder?.merchant?.name || "Mitra UMKM";
        const category = matchingOrder?.merchant?.type || "Bonus";
        return {
            id: point.id,
            type: point.amount >= 0 ? "earning" : "spending",
            description: point.amount >= 0 ? `Cashback Pembelian di ${merchantName}` : `Penukaran Qoin di ${merchantName}`,
            amount: point.amount,
            date: point.created_at,
            merchant: merchantName,
            category: category,
        };
    });
};
exports.getQoinTransactionsService = getQoinTransactionsService;
const redeemQoinService = async (userId, amount) => {
    // Ambil saldo terkini
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId },
        select: { total_point: true },
    });
    if (!user)
        throw new Error("User not found");
    if ((user.total_point ?? 0) < amount) {
        throw new Error(`Qoin tidak mencukupi. Saldo: ${user.total_point}, dibutuhkan: ${amount}`);
    }
    if (amount <= 0)
        throw new Error("Jumlah penukaran harus lebih dari 0");
    // Atomic: kurangi total_point + tambah balance + buat record points negatif
    const [updatedUser, pointRecord] = await prisma_1.default.$transaction([
        prisma_1.default.users.update({
            where: { id: userId },
            data: {
                total_point: { decrement: amount },
                balance: { increment: amount * 1000 },
            },
            select: { total_point: true, email: true, balance: true },
        }),
        prisma_1.default.points.create({
            data: {
                user_id: userId,
                amount: -amount, // negatif = pengeluaran
                expires_in: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                status: "used",
            },
        }),
    ]);
    return {
        remainingBalance: updatedUser.total_point,
        redeemedAmount: amount,
        equivalentRupiah: amount * 1000,
        pointRecord,
    };
};
exports.redeemQoinService = redeemQoinService;
const topUpBalanceService = async (userId, amount) => {
    if (amount <= 0)
        throw new Error("Jumlah top-up harus lebih dari 0");
    const updatedUser = await prisma_1.default.users.update({
        where: { id: userId },
        data: {
            balance: {
                increment: amount,
            },
        },
        select: { id: true, email: true, balance: true },
    });
    return updatedUser;
};
exports.topUpBalanceService = topUpBalanceService;
const updateProfileService = async (userId, data) => {
    const updatedUser = await prisma_1.default.users.update({
        where: { id: userId },
        data,
    });
    return updatedUser;
};
exports.updateProfileService = updateProfileService;
