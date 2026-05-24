"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMerchantRating = exports.getMerchantById = exports.addMerchant = void 0;
const merchant_service_1 = require("./merchant.service");
const uploadToSupabase_1 = require("../../shared/uploadToSupabase");
const addMerchant = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id;
        const { name, type, location, description, latitude, longitude } = req.body;
        const files = req.files;
        let profileUrl = "";
        let bannerUrl = "";
        const galleryUrls = [];
        if (files?.profile_photo?.[0]) {
            // console.log("[merchant.register] uploading profile");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(files.profile_photo[0], "profiles");
            profileUrl = uploaded.url;
        }
        if (files?.banner_img?.[0]) {
            // console.log("[merchant.register] uploading banner");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(files.banner_img[0], "banners");
            bannerUrl = uploaded.url;
        }
        if (files?.gallery_photos && files.gallery_photos.length > 0) {
            // console.log(
            // "[merchant.register] uploading gallery count:",
            // files.gallery_photos.length
            // );
            for (const file of files.gallery_photos) {
                const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(file, "gallery");
                galleryUrls.push(uploaded.url);
            }
        }
        const latNum = latitude ? parseFloat(latitude) : undefined;
        const lngNum = longitude ? parseFloat(longitude) : undefined;
        const merchant = await (0, merchant_service_1.addMerchantService)({
            user_id,
            name,
            type,
            location,
            description,
            profile_photo: profileUrl,
            banner_img: bannerUrl,
            gallery_photo: galleryUrls[0] || "",
            latitude: latNum,
            longitude: lngNum,
            profilePhotoUrl: profileUrl,
            bannerImageUrl: bannerUrl,
            galleryImages: galleryUrls,
        });
        res.status(201).json({
            message: "Merchant added successfully",
            status: "success",
            data: merchant,
        });
    }
    catch (err) {
        console.error("[merchant.register] error:", err);
        next(err);
    }
};
exports.addMerchant = addMerchant;
const getMerchantById = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        // console.log(merchant_id);
        const merchant = await (0, merchant_service_1.getMerchantByIdService)(merchant_id);
        // console.log(merchant);
        return res.status(200).json({
            message: "Merchant fetched successfully",
            status: "success",
            data: merchant,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMerchantById = getMerchantById;
const addMerchantRating = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const { user_id } = req.user;
        const { rate, comment } = req.body;
        const rating = await (0, merchant_service_1.addMerchantRatingService)(merchant_id, user_id, rate, comment);
        return res.status(201).json({
            status: "success",
            message: "Merchant rating added successfully",
            data: rating,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.addMerchantRating = addMerchantRating;
