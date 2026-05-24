"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserService = exports.loginAccountService = exports.createAccountService = void 0;
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
