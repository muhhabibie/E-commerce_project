"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMerchantRatingSchema = exports.addMerchantSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// For multipart we only validate textual fields here; files are handled via multer.
exports.addMerchantSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    type: zod_1.default.string().min(1, "Type is required"),
    location: zod_1.default.string().min(1, "Location is required"),
    description: zod_1.default.string().min(1).max(500),
    latitude: zod_1.default.string().optional(), // will be parsed to float
    longitude: zod_1.default.string().optional(),
});
exports.addMerchantRatingSchema = zod_1.default.object({
    rate: zod_1.default
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    comment: zod_1.default
        .string()
        .min(1, "Comment must be at least 1 character long")
        .max(500, "Comment must be at most 500 characters long"),
});
