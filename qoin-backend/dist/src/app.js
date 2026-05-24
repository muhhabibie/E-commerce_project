"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./features/auth/auth.route"));
const merchant_route_1 = __importDefault(require("./features/merchant/merchant.route"));
const stocks_route_1 = __importDefault(require("./features/stocks/stocks.route"));
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://qoin-frontend.vercel.app"],
    credentials: true,
}));
// ROUTER
app.use("/api/auth", auth_route_1.default);
app.use("/api/merchant", merchant_route_1.default);
app.use("/api/stocks", stocks_route_1.default);
// MIDDLEWARE HANDLING ERROR
app.use(errorHandler_1.errorHandler);
exports.default = app;
