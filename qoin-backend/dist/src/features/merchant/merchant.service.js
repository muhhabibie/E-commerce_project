"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMerchantRatingService = exports.getMerchantByIdService = exports.addMerchantService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const addMerchantService = async (payload) => {
    const newMerchant = await prisma_1.default.merchants.create({
        data: {
            user_id: payload.user_id,
            name: payload.name,
            type: payload.type,
            location: payload.location,
            description: payload.description,
            profile_photo: payload.profile_photo || "",
            banner_img: payload.banner_img || "",
            gallery_photo: payload.galleryImages?.[0] || payload.gallery_photo || "",
            latitude: payload.latitude ?? null,
            longitude: payload.longitude ?? null,
            profilePhotoUrl: payload.profilePhotoUrl || null,
            bannerImageUrl: payload.bannerImageUrl || null,
            galleryImages: payload.galleryImages ?? [],
        },
    });
    console.log("New merchant added:", newMerchant);
    return newMerchant;
};
exports.addMerchantService = addMerchantService;
const getMerchantByIdService = async (merchant_id) => {
    const merchant = await prisma_1.default.merchants.findUnique({
        where: {
            id: merchant_id,
        },
        include: {
            followers: true,
            ratings: true,
            selledStocks: true,
            stocks: true,
        },
    });
    return merchant;
};
exports.getMerchantByIdService = getMerchantByIdService;
const addMerchantRatingService = async (merchant_id, user_id, rate, comment) => {
    const merchant_rating = await prisma_1.default.merchant_rating.create({
        data: {
            merchant_id,
            user_id,
            rate,
            comment,
        },
    });
    return merchant_rating;
};
exports.addMerchantRatingService = addMerchantRatingService;
