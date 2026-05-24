"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStocksSchema = exports.addStocksSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// For multipart/form-data, numeric fields arrive as strings. Use z.coerce.number.
// Photo can be provided either as an uploaded file (product_photo) OR an existing URL (photo_url).
// Make photo_url optional so validation doesn't fail when a file is uploaded instead.
exports.addStocksSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    quantity: zod_1.default.coerce.number().min(1, "Quantity must be at least 1"),
    price: zod_1.default.coerce.number().min(1, "Price is required"),
});
exports.updateStocksSchema = zod_1.default.object({
    quantity: zod_1.default.coerce.number().min(1, "Quantity must be at least 1"),
});
