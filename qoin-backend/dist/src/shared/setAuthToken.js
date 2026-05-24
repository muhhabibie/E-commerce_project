"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const setAuthToken = (userId, res) => {
    const token = jsonwebtoken_1.default.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // allow HTTP in local dev
        sameSite: "none", // enable cross-site cookie on localhost
        path: "/",
    });
};
exports.default = setAuthToken;
