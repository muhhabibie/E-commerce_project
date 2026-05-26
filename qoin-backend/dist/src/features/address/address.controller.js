"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserAddress = exports.getPrimaryAddress = exports.getUserAddresses = void 0;
const address_service_1 = require("./address.service");
const getUserAddresses = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const addresses = await (0, address_service_1.getUserAddressesService)(userId);
        return res.status(200).json({
            message: "Addresses retrieved successfully",
            status: "success",
            data: addresses,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserAddresses = getUserAddresses;
const getPrimaryAddress = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const address = await (0, address_service_1.getPrimaryAddressService)(userId);
        return res.status(200).json({
            message: "Primary address retrieved successfully",
            status: "success",
            data: address,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPrimaryAddress = getPrimaryAddress;
const saveUserAddress = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        const { name, recipient, phone, address, is_primary } = req.body;
        const newAddress = await (0, address_service_1.saveUserAddressService)(userId, {
            name,
            recipient,
            phone,
            address,
            is_primary,
        });
        return res.status(201).json({
            message: "Address saved successfully",
            status: "success",
            data: newAddress,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.saveUserAddress = saveUserAddress;
