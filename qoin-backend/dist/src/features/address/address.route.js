"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../../middleware/verifyToken");
const address_controller_1 = require("./address.controller");
const addressRoute = (0, express_1.Router)();
// Semua rute address harus melalui autentikasi
addressRoute.use(verifyToken_1.verifyToken);
addressRoute.get("/", address_controller_1.getUserAddresses);
addressRoute.get("/primary", address_controller_1.getPrimaryAddress);
addressRoute.post("/", address_controller_1.saveUserAddress);
exports.default = addressRoute;
