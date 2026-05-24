"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../database/prisma"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { user_id, iat, exp } = decoded;
        // Ensure user exists (helps after DB resets during development)
        const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
        if (!user) {
            res.clearCookie("token");
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }
        req.user = { user_id, iat, exp };
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
