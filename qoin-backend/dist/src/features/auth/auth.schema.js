"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const signUpSchema = zod_1.default.object({
    email: zod_1.default.string().min(1, "Email is required").email("Invalid email format"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
});
exports.signUpSchema = signUpSchema;
const signInSchema = zod_1.default.object({
    email: zod_1.default.string().min(1, "Email is required").email("Invalid email format"),
    password: zod_1.default.string().min(1, "Password is required"),
});
exports.signInSchema = signInSchema;
