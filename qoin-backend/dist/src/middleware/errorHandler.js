"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.APIError = void 0;
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.APIError = APIError;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    // eslint-disable-next-line no-console
    console.error('[errorHandler]', {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
