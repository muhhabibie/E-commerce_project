"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserAddressService = exports.getPrimaryAddressService = exports.getUserAddressesService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const getUserAddressesService = async (userId) => {
    return await prisma_1.default.user_addresses.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            is_primary: "desc", // primary address always first
        },
    });
};
exports.getUserAddressesService = getUserAddressesService;
const getPrimaryAddressService = async (userId) => {
    return await prisma_1.default.user_addresses.findFirst({
        where: {
            user_id: userId,
            is_primary: true,
        },
    });
};
exports.getPrimaryAddressService = getPrimaryAddressService;
const saveUserAddressService = async (userId, data) => {
    // Check if it's the first address
    const existingAddresses = await prisma_1.default.user_addresses.count({
        where: { user_id: userId },
    });
    const isPrimary = existingAddresses === 0 ? true : (data.is_primary ?? true);
    if (isPrimary) {
        // Set all other addresses for this user to not primary
        await prisma_1.default.user_addresses.updateMany({
            where: { user_id: userId },
            data: { is_primary: false },
        });
    }
    // Create new address (for simplicity, we always create a new one as primary for now,
    // or we could update an existing one if ID is provided. Let's just create.)
    return await prisma_1.default.user_addresses.create({
        data: {
            user_id: userId,
            name: data.name,
            recipient: data.recipient,
            phone: data.phone,
            address: data.address,
            is_primary: isPrimary,
        },
    });
};
exports.saveUserAddressService = saveUserAddressService;
