"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.topUpBalance = exports.redeemQoin = exports.getQoinTransactions = exports.getUserPoints = exports.getSocketToken = exports.logoutAccount = exports.getUser = exports.loginAccount = exports.createAccount = void 0;
const auth_service_1 = require("./auth.service");
const setAuthToken_1 = __importDefault(require("../../shared/setAuthToken"));
const createAccount = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Email: ${email}, Password: ${password}`);
        const user = await (0, auth_service_1.createAccountService)(email, password);
        return res.status(201).json({
            message: "Account created successfully",
            status: "success",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createAccount = createAccount;
const loginAccount = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt - Email: ${email}, Password: ${password}`);
        const user = await (0, auth_service_1.loginAccountService)(email, password);
        (0, setAuthToken_1.default)(user.id, res);
        return res.status(200).json({
            message: "Login successful",
            status: "success",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginAccount = loginAccount;
const getUser = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const user = await (0, auth_service_1.getUserService)(userId);
        return res.status(200).json({
            message: "User retrieved successfully",
            status: "success",
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUser = getUser;
const logoutAccount = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
        console.error(err);
    }
};
exports.logoutAccount = logoutAccount;
/**
 * GET /api/auth/socket-token
 * Mengembalikan JWT token dari httpOnly cookie agar bisa digunakan
 * oleh Socket.IO client sebagai auth.token di handshake.
 * Endpoint ini aman karena hanya bisa diakses oleh user yang sudah
 * terautentikasi (dilindungi oleh middleware verifyToken).
 */
const getSocketToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        return res.status(200).json({
            status: "success",
            message: "Socket token retrieved",
            data: { token },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getSocketToken = getSocketToken;
const getUserPoints = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const points = await (0, auth_service_1.getUserPointsService)(user_id);
        return res.status(200).json({
            message: "User points retrieved successfully",
            status: "success",
            data: points,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.getUserPoints = getUserPoints;
const getQoinTransactions = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const transactions = await (0, auth_service_1.getQoinTransactionsService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "Qoin transactions retrieved successfully",
            data: transactions,
        });
    }
    catch (err) {
        console.error("[auth.getQoinTransactions] error:", err);
        next(err);
    }
};
exports.getQoinTransactions = getQoinTransactions;
const redeemQoin = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { amount } = req.body;
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Jumlah penukaran tidak valid",
            });
        }
        const result = await (0, auth_service_1.redeemQoinService)(user_id, Number(amount));
        return res.status(200).json({
            status: "success",
            message: `Berhasil menukar ${amount} Qoin`,
            data: result,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Gagal menukar Qoin";
        if (message.includes("tidak mencukupi")) {
            return res.status(400).json({ status: "error", message });
        }
        next(err);
    }
};
exports.redeemQoin = redeemQoin;
const topUpBalance = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { amount } = req.body;
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Jumlah top-up tidak valid",
            });
        }
        const result = await (0, auth_service_1.topUpBalanceService)(user_id, Number(amount));
        return res.status(200).json({
            status: "success",
            message: `Berhasil melakukan top-up sebesar Rp ${Number(amount).toLocaleString("id-ID")}`,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.topUpBalance = topUpBalance;
const updateProfile = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { name, phone, address, profile_photo } = req.body;
        const updatedUser = await (0, auth_service_1.updateProfileService)(user_id, {
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
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
