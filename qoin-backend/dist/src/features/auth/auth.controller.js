"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.loginAccount = exports.createAccount = void 0;
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
