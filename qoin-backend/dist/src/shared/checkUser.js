"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../database/prisma"));
const checkUser = async (email) => {
    const user = await prisma_1.default.users.findUnique({
        where: {
            email,
        },
    });
    return user;
};
exports.default = checkUser;
